import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/utils/queryKeys';
import apiRequest from '@/utils/fetchData';
import API_ROUTES from '@/utils/apiRoutes';
import { DataWithRatings } from '../types/models/books';
import { RatingInfo, SingleRatingData } from '../types/serverTypes';

interface MutationBase {
   userId: string;
   bookId: string;
   initialData?: SingleRatingData;
}

interface InitializeDataParams extends MutationBase {
   queryClient: QueryClient;
}

export function useMutateUpdateRatings(params: MutationBase) {
   const { bookId, userId } = params;
   const queryClient = useQueryClient();

   const currentRatingData = initializeData({ queryClient, ...params });

   console.log('DEBUGGING');
   console.log('------------------');
   console.log('------------------');
   console.log('------------------');
   console.log('------------------');
   console.log('the currentRatingData is: ', currentRatingData);

   const mutation = useMutation(
      (rating) =>
         apiRequest({
            apiUrl: API_ROUTES.RATING.RATE_BOOK.UPDATE(userId as string, bookId),
            method: 'POST',
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
            console.log('the rating data is: ', prevRatingData);
            console.log('the CURRENT RATING DATA is: ', currentRatingData);
            console.log('-----------------------');
            console.log('-----------------------');
            console.log('-----------------------');
            console.log('-----------------------');

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
         onSettled: (data, error, variables, context) => {
            console.log('WHAT THE FUCK IS THE VARIABLES?: ', variables);
            console.log(
               'THE CONTEXT IS THE PREVIOUS RATING VALUE? : ',
               context?.prevRatingData?.ratingInfo?.ratingValue
            );
            console.log('after settling: ', currentRatingData);
            queryClient.invalidateQueries(queryKeys.ratingsByBookAndUser(bookId, userId));
         },
      }
   );

   return { mutation, currentRatingData };
}

export function useMutateCreateRatings(params: MutationBase) {
   const { bookId, userId } = params;
   const queryClient = useQueryClient();

   const currentRatingData = initializeData({ queryClient, ...params });

   return useMutation(
      (data) =>
         apiRequest({
            apiUrl: API_ROUTES.RATING.RATE_BOOK.CREATE(userId as string, bookId),
            method: 'POST',
            data: { data: data },
         }),
      {
         onMutate: async (data: DataWithRatings) => {
            await queryClient.cancelQueries(queryKeys.ratingsByBookAndUser(bookId, userId));
            const prevRatingData = queryClient.getQueryData<SingleRatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId)
            );
            const optimisticData = setOptimisticData(prevRatingData, data.rating, 'create');
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
            queryClient.invalidateQueries(queryKeys.ratingsByBook(bookId));
         },
      }
   );
}

// if create then it should update the new total
// if update then old value but average changes
// if delete then delete the old value and total is subtracted
function setOptimisticData(
   initialData: SingleRatingData | undefined,
   rating: number,
   type: 'create' | 'update' | 'delete'
): SingleRatingData | undefined {
   if (!initialData) {
      return;
   }
   const newCount = initialData.count + (type === 'create' ? 1 : type === 'delete' ? -1 : 0);
   const newAvg = calculateNewAverage(type, initialData.avg, initialData.count, rating);

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
   type: 'create' | 'update' | 'delete',
   oldAvg: number,
   oldCount: number,
   rating: number
): number {
   switch (type) {
      case 'create':
         return (oldAvg * oldCount + rating) / (oldCount + 1);
      case 'update':
         return (oldAvg * (oldCount - 1) + rating) / oldCount;
      case 'delete':
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
