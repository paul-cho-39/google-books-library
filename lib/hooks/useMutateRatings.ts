import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '../../utils/queryKeys';
import apiRequest from '../../utils/fetchData';
import API_ROUTES from '../../utils/apiRoutes';
import { DataWithRatings } from '../types/models/books';
import { RatingData } from '../types/serverTypes';

interface MutationBase {
   userId: string;
   bookId: string;
}

export function useMutateUpdateRatings({ bookId, userId }: MutationBase) {
   const queryClient = useQueryClient();

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
            const prevRatingData = queryClient.getQueryData<RatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId)
            );
            const optimisticData = setOptimisticData(prevRatingData, rating);
            queryClient.setQueryData<RatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId),
               optimisticData
            );

            return { prevRatingData };
         },
         onError: (_err, _variables, context) => {
            if (context?.prevRatingData) {
               queryClient.setQueryData<RatingData>(
                  queryKeys.ratingsByBookAndUser(bookId, userId),
                  context?.prevRatingData
               );
            }
         },
         onSettled: () => {
            queryClient.invalidateQueries(queryKeys.ratingsByBookAndUser(bookId, userId));
         },
      }
   );

   return mutation;
}

export function useMutateCreateRatings({ userId, bookId }: MutationBase) {
   const queryClient = useQueryClient();

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
            const prevRatingData = queryClient.getQueryData<RatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId)
            );
            const optimisticData = setOptimisticData(prevRatingData, data.rating);
            queryClient.setQueryData<RatingData>(
               queryKeys.ratingsByBookAndUser(bookId, userId),
               optimisticData
            );

            return { prevRatingData };
         },
         onError: (_err, _variables, context) => {
            if (context?.prevRatingData) {
               queryClient.setQueryData<RatingData>(
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

function setOptimisticData(
   initialData: RatingData | undefined,
   rating: number
): RatingData | undefined {
   if (!initialData) {
      return;
   }
   return {
      ...initialData,
      ratingValue: rating,
   };
}
