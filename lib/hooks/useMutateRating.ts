import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/utils/queryKeys';
import apiRequest from '@/utils/fetchData';
import API_ROUTES from '@/utils/apiRoutes';
import {
   InitializeDataParams,
   MultipleQueryDataParams,
   MutationBase,
   MutationRatingActionType,
   MutationRatingData,
} from '../types/models/books';
import { MultipleRatingData, RatingData, RatingInfo, SingleRatingData } from '../types/serverTypes';
import { Method } from '../types/fetchbody';

export default function useMutateRatings<ActionType extends MutationRatingActionType>(
   params: MutationBase,
   action: ActionType
) {
   const { bookId, userId, inLibrary } = params;
   const queryClient = useQueryClient();

   const { apiUrl, method } = getApiUrl(action, userId, bookId);
   const currentRatingData = initializeData({ queryClient, ...params });

   const mutation = useMutation(
      (data) =>
         apiRequest({
            apiUrl: apiUrl,
            method: method as Method,
            data: { data: data },
            shouldRoute: false,
         }),
      {
         onMutate: async (data: MutationRatingData<ActionType>) => {
            let rating: number;
            await queryClient.cancelQueries(queryKeys.ratingsByBookAndUser(bookId, userId));
            // from the same data that is being returned
            // setting the data 'rating' for optimistic update
            const prevRatingData = queryClient.getQueryData<SingleRatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId)
            );
            const prevMultipleRatingData = queryClient.getQueryData<MultipleRatingData>(
               queryKeys.ratingsByBook(bookId)
            );

            // if there is no previous rating data the rating value is 0
            if (!currentRatingData) {
               rating = 0;
            }

            // returns the current rating
            rating = getRatingFromMutation(data, action, prevRatingData);

            // console.log('----------TESTING--------------');
            // console.log('----------TESTING--------------');
            // console.log('----------TESTING--------------');
            // console.log('TESTING THE RATING HERE: ', rating);

            // ---------- SETTING OPTIMISITC DATA -----------------------
            // TODO: change the params for 'setOptimisticData'
            const optimisticData = setOptimisticData({
               action,
               newRating: rating,
               prevRatingData,
               bookId,
               userId,
               inLibrary,
            });

            // ------------------------------------------------------------

            queryClient.setQueryData<SingleRatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId),
               optimisticData
            );

            setMultipleQueryData(queryClient, {
               action: action,
               bookId: bookId,
               inLibrary,
               newRating: rating,
               prevRatingData: prevRatingData,
               userId: userId,
            });

            // the previous rating data before updating
            return { prevRatingData, prevMultipleRatingData };
         },
         // TODO: set toast message here when failing to submit
         onError: (_err, _variables, context) => {
            console.error('RECIEVED AN ERROR', _err);
            if (context?.prevRatingData) {
               // rolle back the data here
               queryClient.setQueryData<SingleRatingData>(
                  queryKeys.ratingsByBookAndUser(bookId, userId),
                  context?.prevRatingData
               );
            }

            if (context?.prevMultipleRatingData) {
               queryClient.setQueryData<MultipleRatingData>(
                  queryKeys.ratingsByBook(bookId),
                  context?.prevMultipleRatingData
               );
            }
         },
         onSettled: (_data, error, variables, context) => {
            // setMultipleQueryData({
            //    queryClient,
            //    bookId,
            //    userId,
            //    context,
            //    inLibrary,
            //    newRating: variables?.rating,
            // });

            // the previous currentRatingData is invalidated and currentRatingData is fresh
            if (error) {
               console.error(error);
            }
            // console.log(
            //    'INSIDE USEMUTATERATINGS------------>>>>>>>>>>>>>>>>>>>>>>>, THE DATA IS: ',
            //    _data
            // );
            // console.log(
            //    'INSIDE USEMUTATERATINGS------------>>>>>>>>>>>>>>>>>>>>>>>, THE CONTEXT IS: ',
            //    context
            // );

            queryClient.invalidateQueries(queryKeys.ratingsByBookAndUser(bookId, userId));

            // adding invalidation here
            // queryClient.invalidateQueries(queryKeys.ratingsByBook(bookId));
         },
         // onSuccess: () => {
         //    queryClient.invalidateQueries(queryKeys.ratingsByBook(bookId));
         // },
      }
   );

   return { mutation, currentRatingData };
}

function getApiUrl(action: MutationRatingActionType, userId: string, bookId: string) {
   const routeMap = {
      create: { apiUrl: API_ROUTES.RATING.RATE_BOOK.CREATE(userId, bookId), method: 'POST' },
      update: { apiUrl: API_ROUTES.RATING.RATE_BOOK.UPDATE(userId, bookId), method: 'POST' },
      remove: { apiUrl: API_ROUTES.RATING.RATE_BOOK.CREATE(userId, bookId), method: 'DELETE' },
   };

   return routeMap[action] || {};
}

/**
 * sets the data unless there is an error
 * it calculates the new average and sets the count, avg, and ratingInfo
 *
 * @param params
 * @returns {object}SingleRatingData
 */
function setOptimisticData(params: MultipleQueryDataParams): SingleRatingData {
   const { prevRatingData, action, newRating } = params;

   const newCount = setNewCount(prevRatingData, action);

   const oldRating = params.prevRatingData?.ratingInfo?.ratingValue;

   // console.log('----------TESTING--------------');
   // console.log('----------TESTING--------------');
   // console.log('----------TESTING--------------');
   // console.log('HERE IS THE OLD RATING: ', oldRating);

   const newAvg = calculateNewAverage(
      action,
      prevRatingData?.avg,
      prevRatingData?.count,
      newRating,
      oldRating
   );

   return {
      ...prevRatingData,
      ratingInfo: {
         ...(prevRatingData?.ratingInfo as RatingInfo),
         bookId: params.bookId,
         userId: params.userId,
         ratingValue: newRating || 0,
      },
      inLibrary: params.inLibrary,
      count: newCount,
      avg: newAvg,
   };
}

function setNewCount(initialData: SingleRatingData | undefined, action: MutationRatingActionType) {
   const currentCount = initialData?.count || 0;
   switch (action) {
      case 'create':
         return currentCount + 1;
      case 'update':
         // if the book is already recorded in the library
         // and if the rating is deleted the current count should equal to 0
         return currentCount <= 0 ? Math.max(currentCount, 0) + 1 : currentCount;
      case 'remove':
         return currentCount - 1;
      default:
         return currentCount;
   }
}

function calculateNewAverage(
   type: MutationRatingActionType,
   oldAvg: number = 0,
   oldCount: number = 0,
   newRating: number = 0,
   oldRating: number = 0
): number {
   switch (type) {
      case 'create':
         return (oldAvg * oldCount + newRating) / (oldCount + 1);
      case 'update':
         // if the user has not rated returns the new rating
         if (oldCount === 0) return newRating;
         // const currentCount = oldCount <= 0 ? oldCount + 1 : oldCount;
         // return (oldAvg * (oldCount - 1) + rating) / currentCount;
         return (oldAvg * oldCount - oldRating + newRating) / oldCount;
      case 'remove':
         // should equal to 0 when removing
         return oldCount <= 1 ? 0 : (oldAvg * oldCount - oldRating) / (oldCount - 1);
      default:
         return oldAvg;
   }
}

// have to manually update the cache
// for it to be updated and persist over in useMutation
function initializeData(params: InitializeDataParams) {
   const { queryClient, bookId, userId, prevRatingData } = params;
   const currentRatingData = queryClient.getQueryData<SingleRatingData>(
      queryKeys.ratingsByBookAndUser(bookId, userId)
   );

   if (!currentRatingData && prevRatingData) {
      queryClient.setQueryData<SingleRatingData>(
         queryKeys.ratingsByBookAndUser(bookId, userId),
         prevRatingData
      );
   }

   return currentRatingData;
}

function getRatingFromMutation<ActionType extends MutationRatingActionType>(
   data: MutationRatingData<ActionType>,
   action: ActionType,
   prevData: SingleRatingData | undefined
) {
   // when the rating is being removed it should equal to 0
   if (action === 'remove') {
      return prevData?.ratingInfo?.ratingValue || 0;
   }

   // in case there is a failure otherwise returns the rating
   return data?.rating || 0;
}

// queryClient
// context
// newRating
// function setMultipleQueryData(params: MultipleQueryDataParams) {
//    // const { context, queryClient, ...restParams } = params;
//    const { context, queryClient, ...restParams } = params;
//    const ratingData = queryClient.getQueryData<MultipleRatingData>(
//       queryKeys.ratingsByBook(restParams.bookId)
//    ) as MultipleRatingData;

//    // console.log('--RIGHT BEFORE RETURNING BECAUSE THERE IS NO DATA?');
//    // console.log('--HERE IS THE RATING DATA: ', ratingData);
//    // console.log('--HERE IS THE CONTEXT: ', context);
//    // console.log('--HERE IS THE RATING DATA: ', context?.prevRatingData);

//    if (!ratingData || !context) return;

//    const { prevRatingData, action } = context;

//    const oldRating = prevRatingData?.ratingInfo?.ratingValue || 0;

//    const newAvg = calculateNewAverage(
//       action,
//       ratingData?.avg,
//       ratingData?.count,
//       restParams.newRating,
//       oldRating
//    );

//    const count = setNewCount(prevRatingData, action);
//    const ratingInfo = getRatingInfo(ratingData, action, restParams);

//    console.log('*********INSIDE THE USEMUTATE**************, THE RATING DATA IS: ', ratingData);
//    console.log('*********INSIDE THE USEMUTATE**************', ratingInfo);

//    queryClient.setQueryData<MultipleRatingData>(queryKeys.ratingsByBook(restParams.bookId), {
//       ...ratingData,
//       avg: newAvg,
//       count: count,
//       ratingInfo: ratingInfo,
//    });
// }

function setMultipleQueryData(queryClient: QueryClient, params: MultipleQueryDataParams) {
   // const { context, queryClient, ...restParams } = params;
   const { prevRatingData, action, ...restParams } = params;
   const ratingData = queryClient.getQueryData<MultipleRatingData>(
      queryKeys.ratingsByBook(restParams.bookId)
   ) as MultipleRatingData;

   // console.log('--RIGHT BEFORE RETURNING BECAUSE THERE IS NO DATA?');
   // console.log('--HERE IS THE RATING DATA: ', ratingData);
   // console.log('--HERE IS THE RATING DATA: ', );

   if (!ratingData) {
      throw new Error(
         `There is no data provided. Provide the proper data to set the data for MultipleRatingData.`
      );
   }

   const oldRating = prevRatingData?.ratingInfo?.ratingValue || 0;

   const newAvg = calculateNewAverage(
      action,
      ratingData?.avg,
      ratingData?.count,
      restParams.newRating,
      oldRating
   );

   const count = setNewCount(prevRatingData, action);
   const ratingInfo = getRatingInfo(ratingData, action, restParams);

   // console.log('*********INSIDE THE USEMUTATE**************, THE RATING DATA IS: ', ratingData);
   // console.log('*********INSIDE THE USEMUTATE**************', ratingInfo);

   queryClient.setQueryData<MultipleRatingData>(queryKeys.ratingsByBook(restParams.bookId), {
      ...ratingData,
      avg: newAvg,
      count: count,
      ratingInfo: ratingInfo,
   });
}

interface RatingInfoParams {
   bookId: string;
   userId: string;
   inLibrary: boolean;
   newRating: number | undefined;
}

/**
 * Retrieves new rating and rating data from 'action' and updates the current RatingInfo
 * @param ratingData
 * @param action
 * @param params
 * @returns {Array} RatingInfo[]
 */
function getRatingInfo(
   ratingData: MultipleRatingData,
   // prevData: SingleRatingData,
   action: MutationRatingActionType,
   params: RatingInfoParams
): RatingInfo[] | undefined {
   const { bookId, userId, newRating, inLibrary } = params;

   switch (action) {
      case 'remove':
         const newData = ratingData.ratingInfo?.filter((data) => data.userId !== userId);
         return newData;
      // return ratingData.ratingInfo?.filter((data) => data.userId !== userId);
      case 'update':
         const userRatingData = ratingData.ratingInfo?.find((data) => data.userId === userId);
         const dateAdded = !userRatingData ? new Date() : userRatingData.dateAdded;

         const updatedRatingInfo: RatingInfo = {
            bookId: bookId,
            userId: userId,
            ratingValue: newRating || 0,
            dateAdded: dateAdded,
            dateUpdated: new Date(),
         };

         return ratingData.ratingInfo
            ? upsertRatingInfo([...ratingData.ratingInfo], updatedRatingInfo)
            : [updatedRatingInfo];

      case 'create':
         const newRatingInfo: RatingInfo = {
            bookId: bookId,
            userId: userId,
            ratingValue: newRating || 0,
            dateAdded: new Date(),
            dateUpdated: new Date(),
         };

         return ratingData.ratingInfo
            ? upsertRatingInfo([...ratingData.ratingInfo], newRatingInfo)
            : [newRatingInfo];

      default:
         return ratingData.ratingInfo;
   }
}

// if the userId is not found then create a new one
function upsertRatingInfo(ratingInfoArray: RatingInfo[], newInfo: RatingInfo): RatingInfo[] {
   const index = ratingInfoArray.findIndex((info) => info.userId === newInfo.userId);
   if (index > -1) {
      // if found then update it to the new info
      ratingInfoArray[index] = newInfo;
   } else {
      // add the new rating info if it doesn't exist
      ratingInfoArray.push(newInfo);
   }
   return ratingInfoArray;
}
