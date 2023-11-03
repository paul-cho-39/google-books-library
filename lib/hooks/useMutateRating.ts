import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/utils/queryKeys';
import apiRequest from '@/utils/fetchData';
import API_ROUTES from '@/utils/apiRoutes';
import { DataWithRatings, RatingsWithoutData } from '../types/models/books';
import { MultipleRatingData, RatingData, RatingInfo, SingleRatingData } from '../types/serverTypes';
import { Method } from '../types/fetchbody';

interface InitializeDataParams extends MutationBase {
   queryClient: QueryClient;
}

type MutationRatingActionType = 'create' | 'update' | 'remove';
type MutationRatingDataTypes = {
   create: DataWithRatings;
   update: RatingsWithoutData;
   remove: null;
};
type MutationRatingData<ActionType extends MutationRatingActionType> =
   MutationRatingDataTypes[ActionType];

export interface MutationBase {
   userId: string;
   bookId: string;
   inLibrary: boolean;
   initialData?: SingleRatingData;
}

interface MultipleQueryDataParams extends Omit<MutationBase, 'initialData'> {
   queryClient: QueryClient;
   context:
      | {
           prevRatingData: SingleRatingData | undefined;
           action: MutationRatingActionType;
        }
      | undefined;
   newRating: number | undefined;
}

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

            // if there is no previous rating data the rating value is 0
            if (!currentRatingData) {
               rating = 0;
            }
            rating = getRatingFromMutation(data, action, prevRatingData);

            const optimisticData = setOptimisticData(
               {
                  initialData: prevRatingData,
                  bookId,
                  userId,
                  inLibrary,
               },
               action,
               rating
            );

            queryClient.setQueryData<SingleRatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId),
               optimisticData
            );

            // the previous rating data before updating
            return { prevRatingData, action };
         },
         onError: (_err, _variables, context) => {
            console.error('RECIEVED AN ERROR', _err);
            if (context?.prevRatingData) {
               queryClient.setQueryData<SingleRatingData>(
                  queryKeys.ratingsByBookAndUser(bookId, userId),
                  context?.prevRatingData
               );
            }
         },
         onSettled: (_data, _error, variables, context) => {
            setMultipleQueryData({
               queryClient,
               bookId,
               userId,
               context,
               inLibrary,
               newRating: variables?.rating,
            });

            // the previous currentRatingData is invalidated and currentRatingData is fresh
            queryClient.invalidateQueries(queryKeys.ratingsByBookAndUser(bookId, userId));
         },
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

// it wont update properly because create is not ACTUALLY create
// when the rating is deleted it is still 'UPDATE' not 'CREATE'

function setOptimisticData(
   params: MutationBase,
   action: MutationRatingActionType,
   rating: number
): SingleRatingData {
   const { initialData } = params;

   const newCount = setNewCount(initialData, action);
   const newAvg = calculateNewAverage(action, initialData?.avg, initialData?.count, rating);

   return {
      ...initialData,
      ratingInfo: {
         ...(initialData?.ratingInfo as RatingInfo),
         bookId: params.bookId,
         userId: params.userId,
         ratingValue: rating,
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
   rating: number = 0
): number {
   switch (type) {
      case 'create':
         return (oldAvg * oldCount + rating) / (oldCount + 1);
      case 'update':
         const currentCount = oldCount <= 0 ? oldCount + 1 : oldCount;
         return (oldAvg * (oldCount - 1) + rating) / currentCount;
      case 'remove':
         // should equal to 0 when removing
         return oldCount <= 1 ? 0 : (oldAvg * oldCount - rating) / (oldCount - 1);
      default:
         return oldAvg;
   }
}

// have to manually update the cache
// for it to be updated and persist over in useMutation
function initializeData(params: InitializeDataParams) {
   const { queryClient, bookId, userId, initialData } = params;
   const currentRatingData = queryClient.getQueryData<SingleRatingData>(
      queryKeys.ratingsByBookAndUser(bookId, userId)
   );

   if (!currentRatingData && initialData) {
      queryClient.setQueryData<SingleRatingData>(
         queryKeys.ratingsByBookAndUser(bookId, userId),
         initialData
      );
   }

   return currentRatingData;
}

function getRatingFromMutation<ActionType extends MutationRatingActionType>(
   data: MutationRatingData<ActionType>,
   action: ActionType,
   prevData: SingleRatingData | undefined
) {
   if (action === 'remove') {
      return prevData?.ratingInfo?.ratingValue || 0;
   }

   return data?.rating || 0;
}

function setMultipleQueryData(params: MultipleQueryDataParams) {
   const { context, queryClient, ...restParams } = params;
   const ratingData = queryClient.getQueryData<MultipleRatingData>(
      queryKeys.ratingsByBook(restParams.bookId)
   ) as MultipleRatingData;

   if (!ratingData || !context || !context.prevRatingData) return;

   const { prevRatingData, action } = context;

   const newAvg = calculateNewAverage(
      action,
      ratingData?.avg,
      ratingData?.count,
      restParams.newRating
   );

   const count = setNewCount(prevRatingData, action);
   const ratingInfo = getRatingInfo(ratingData, prevRatingData, action, restParams);

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

function getRatingInfo(
   ratingData: MultipleRatingData,
   prevData: SingleRatingData,
   action: MutationRatingActionType,
   params: RatingInfoParams
): RatingInfo[] | undefined {
   const { bookId, userId, newRating, inLibrary } = params;

   switch (action) {
      case 'remove':
         return ratingData.ratingInfo?.filter((data) => data.userId !== userId);
      // if the userId is not found then create a new one
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
