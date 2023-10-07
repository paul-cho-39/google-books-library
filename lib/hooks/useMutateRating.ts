import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '../../utils/queryKeys';
import apiRequest from '../../utils/fetchData';
import API_ROUTES from '../../utils/apiRoutes';
import { DataWithRatings } from '../types/models/books';
import { MultipleRatingData, RatingInfo, SingleRatingData } from '../types/serverTypes';
import { Method } from '../types/fetchbody';
import { findId } from './useGetRatings';

interface InitializeDataParams extends MutationBase {
   queryClient: QueryClient;
}

type MutationRatingActionType = 'create' | 'update' | 'remove';
type MutationRatingDataTypes = {
   create: DataWithRatings;
   update: Omit<DataWithRatings, 'bookData'>;
   remove: null;
};
type MutationRatingData<ActionType extends MutationRatingActionType> =
   MutationRatingDataTypes[ActionType];

interface MutationBase {
   userId: string;
   bookId: string;
   initialData?: SingleRatingData;
}

export default function useMutateRatings<ActionType extends MutationRatingActionType>(
   params: MutationBase,
   action: ActionType
) {
   const { bookId, userId } = params;
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
            // set that data 'rating' for optimistic update
            const prevRatingData = queryClient.getQueryData<SingleRatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId)
            );

            // if there is no data rating is 0
            if (!currentRatingData) {
               rating = 0;
            }
            rating = getRatingFromMutation(data, action, prevRatingData);

            const optimisticData = setOptimisticData(prevRatingData, rating, action);
            queryClient.setQueryData<SingleRatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId),
               optimisticData
            );

            // the previous rating data before updating
            return { prevRatingData, action };
         },
         onError: (_err, _variables, context) => {
            if (context?.prevRatingData) {
               queryClient.setQueryData<SingleRatingData>(
                  queryKeys.ratingsByBookAndUser(bookId, userId),
                  context?.prevRatingData
               );
            }
         },
         onSettled: (_data, _error, _variables, context) => {
            // console.log('after settling: ', currentRatingData);
            setQueryDataOnRemove(queryClient, bookId, context);
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

function setOptimisticData(
   initialData: SingleRatingData | undefined,
   rating: number,
   action: MutationRatingActionType
): SingleRatingData | undefined {
   if (!initialData) return;

   const incrementBy = action === 'create' ? 1 : action === 'remove' ? -1 : 0;
   const newCount = initialData.count + incrementBy;
   const newAvg = calculateNewAverage(action, initialData.avg, initialData.count, rating);

   return {
      ...initialData,
      ratingInfo: {
         ...(initialData.ratingInfo as RatingInfo),
         ratingValue: rating,
      },
      count: newCount,
      avg: newAvg,
   };
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
         return (oldAvg * (oldCount - 1) + rating) / oldCount;
      case 'remove':
         return (oldAvg * oldCount - rating) / (oldCount - 1);
      default:
         return oldAvg;
   }
}

// thought react query would handle this but had to force update the cache
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

   return data?.rating ?? 0;
}

function setQueryDataOnRemove(
   queryClient: QueryClient,
   bookId: string,
   context:
      | {
           prevRatingData: SingleRatingData | undefined;
           action: MutationRatingActionType;
        }
      | undefined
) {
   if (!context) return;

   const { prevRatingData } = context;

   // if removed ratingData has to be available
   const ratingData = queryClient.getQueryData<MultipleRatingData>(
      queryKeys.ratingsByBook(bookId)
   ) as MultipleRatingData;

   if (!ratingData || !prevRatingData) return;

   const newAvg = calculateNewAverage(
      'remove',
      prevRatingData?.avg,
      prevRatingData?.count,
      prevRatingData?.ratingInfo?.ratingValue
   );
   const count = Math.max(prevRatingData?.count || 0 - 1, 0);

   const updatedRatingInfo = ratingData.ratingInfo?.filter((rating) => {
      if (prevRatingData) {
         rating.userId !== prevRatingData?.ratingInfo?.userId ||
            rating.bookId !== prevRatingData.ratingInfo.bookId;
      }
   });

   console.log('DEBUGGING INSDIE SETQUERYONREMOVE');
   console.log('--------------------------');
   console.log('--------------------------');
   console.log('--------------------------');
   console.log('--------------------------');
   console.log('after removing, this is the data: ', updatedRatingInfo);

   // it may be better to pass params with 'isDeleted' instead
   queryClient.setQueryData<MultipleRatingData>(queryKeys.ratingsByBook(bookId), {
      ...ratingData,
      avg: newAvg,
      count: count,
      ratingInfo: updatedRatingInfo,
   });
}
