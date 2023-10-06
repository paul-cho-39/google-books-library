import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '../../utils/queryKeys';
import apiRequest from '../../utils/fetchData';
import API_ROUTES from '../../utils/apiRoutes';
import { DataWithRatings } from '../types/models/books';
import { RatingInfo, SingleRatingData } from '../types/serverTypes';
import { Method } from '../types/fetchbody';

type MutationRatingActionType = 'create' | 'update' | 'remove';
interface MutationBase {
   userId: string;
   bookId: string;
   initialData?: SingleRatingData;
}

export default function useMutateRatings(
   params: MutationBase,
   action: 'create' | 'update' | 'remove'
) {
   const { bookId, userId } = params;
   const queryClient = useQueryClient();

   const { apiUrl, method } = getApiUrl(action, userId, bookId);
   const currentRatingData = initializeData({ queryClient, ...params });

   const mutation = useMutation(
      (rating) =>
         apiRequest({
            apiUrl: apiUrl,
            method: method,
            data: { rating: rating },
            shouldRoute: false,
         }),
      {
         onMutate: async (rating: number) => {
            await queryClient.cancelQueries(queryKeys.ratingsByBookAndUser(bookId, userId));
            // from the same data that is being returned
            // set that data 'rating' for optimistic update
            const prevRatingData = queryClient.getQueryData<SingleRatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId)
            );
            const optimisticData = setOptimisticData(prevRatingData, rating, 'update');
            queryClient.setQueryData<SingleRatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId),
               optimisticData
            );

            return { prevRatingData };
         },
         onError: (_err, _variables, context) => {
            if (context?.prevRatingData) {
               queryClient.setQueryData<SingleRatingData>(
                  queryKeys.ratingsByBookAndUser(bookId, userId),
                  context?.prevRatingData
               );
            }
         },
         onSettled: () => {
            console.log('after settling: ', currentRatingData);
            queryClient.invalidateQueries(queryKeys.ratingsByBookAndUser(bookId, userId));
         },
      }
   );
}

function getApiUrl(action: MutationRatingActionType, userId: string, bookId: string) {
   let apiUrl: string, method: Method;
   switch (action) {
      case 'create':
         apiUrl = API_ROUTES.RATING.RATE_BOOK.CREATE(userId as string, bookId);
         method = 'POST';
         break;
      case 'update':
         apiUrl = API_ROUTES.RATING.RATE_BOOK.UPDATE(userId as string, bookId);
         method = 'POST';
         break;
      case 'remove':
         apiUrl = API_ROUTES.RATING.RATE_BOOK.CREATE(userId as string, bookId);
         method = 'DELETE';
         break;
   }

   return { apiUrl, method };
}

interface InitializeDataParams extends MutationBase {
   queryClient: QueryClient;
}

function setOptimisticData(
   initialData: SingleRatingData | undefined,
   rating: number,
   action: MutationRatingActionType
): SingleRatingData | undefined {
   if (!initialData) {
      return;
   }
   const newCount = initialData.count + (action === 'create' ? 1 : action === 'remove' ? -1 : 0);
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
   oldAvg: number,
   oldCount: number,
   rating: number
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
