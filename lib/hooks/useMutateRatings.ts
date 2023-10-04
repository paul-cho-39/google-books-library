import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '../../utils/queryKeys';
import apiRequest from '../../utils/fetchData';
import API_ROUTES from '../../utils/apiRoutes';
import { SingleRateData } from '../types/serverPropsTypes';

interface MutationRatingsParam {
   userId: string | null;
   bookId: string;
   prevRating?: number;
}

export default function useMutateRatings({ bookId, userId, prevRating }: MutationRatingsParam) {
   const queryClient = useQueryClient();

   const mutation = useMutation(
      //   queryKeys.ratingsByBook(bookId),
      (rating) =>
         apiRequest({
            apiUrl: API_ROUTES.RATING.RATE_BOOK(userId as string, bookId),
            method: 'POST',
            data: { rating: rating },
            shouldRoute: false,
         }),
      {
         onMutate: async (rating: number) => {
            await queryClient.cancelQueries(queryKeys.ratingsByBook(bookId));
            // from the same data that is being returned
            // set that data 'rating' for optimistic update
            const prevRatingData = queryClient.getQueryData<SingleRateData>(
               queryKeys.ratingsByBook(bookId)
            );
            // function to update this
            if (prevRatingData) {
               queryClient.setQueryData<SingleRateData>(queryKeys.ratingsByBook(bookId), {
                  ...prevRatingData,
                  ratingValue: rating,
               });
            }

            return { prevRatingData };
         },
         onError: (_err, _variables, context) => {
            if (context?.prevRatingData) {
               queryClient.setQueryData<SingleRateData>(
                  queryKeys.ratingsByBook(bookId),
                  context?.prevRatingData
               );
            }
         },
         onSettled: () => {
            queryClient.invalidateQueries(queryKeys.ratingsByBook(bookId));
         },
      }
   );

   return mutation;
}
