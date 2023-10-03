import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '../../utils/queryKeys';
import apiRequest from '../../utils/fetchData';
import API_ROUTES from '../../utils/apiRoutes';

interface MutationRatingsParam {
   bookId: string;
   userId: string;
   prevRating?: number;
}

export default function useMutateRatings({ bookId, userId, prevRating }: MutationRatingsParam) {
   // first get rating from
   // then optimistic update from here
   const queryClient = useQueryClient();

   const mutation = useMutation(
      //   queryKeys.ratingsByBook(bookId),
      (body: unknown) =>
         apiRequest({
            apiUrl: API_ROUTES.RATING.RATE_BOOK(bookId, userId),
            method: 'POST',
            data: { rating: body },
            shouldRoute: false,
         }),
      {
         onMutate: async () => {
            await queryClient.cancelQueries(queryKeys.ratingsByBook(bookId));
            // from the same data that is being returned
            // set that data 'rating' for optimistic update
            return prevRating || null;
         },
         onError: () => {
            queryClient.cancelQueries(queryKeys.ratingsByBook(bookId));
         },
         onSettled: () => {
            queryClient.invalidateQueries(queryKeys.ratingsByBook(bookId));
         },
         onSuccess: (body) => {
            queryClient.setQueryData(queryKeys.ratingsByBook(bookId), body);
         },
      }
   );

   return mutation;
}
