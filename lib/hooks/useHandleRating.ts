import { useCallback } from 'react';
import { getBodyFromFilteredGoogleFields } from '../helper/books/getBookBody';
import { Items } from '../types/googleBookTypes';
import { DataWithRatings, MutationBase, RatingsWithoutData } from '../types/models/books';
import { MultipleRatingData } from '../types/serverTypes';
import useMutateRatings from './useMutateRating';
import { useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/utils/queryKeys';

function useHandleRating(
   params: MutationBase,
   data: Items<any>,
   currentAllRatingData: MultipleRatingData | null | undefined
) {
   // ----------------TESTING-------------------
   const queryClient = useQueryClient();
   // const allRatingData = queryClient.getQueryData(queryKeys.optimisticRatingsByBookAndUser(params.bookId, params.userId));

   const allRatingData = queryClient.getQueryData(queryKeys.ratingsByBook(params.bookId));

   // ----------------TESTING-------------------

   const {
      mutation: { mutate: createMutation, isLoading: isCreateLoading, isError: isCreateError },
      currentRatingData,
   } = useMutateRatings<'create'>(params, 'create');

   const {
      mutation: { mutate: updateMutation, isLoading: isUpdateLoading, isError: isUpdateError },
   } = useMutateRatings<'update'>(params, 'update');

   const {
      mutation: { mutate: removeMutation, isLoading: isRemoveLoading, isError: isRemoveError },
   } = useMutateRatings<'remove'>(params, 'remove');

   const handleMutation = (rating: number) => {
      // create a book based on all ratings not user book rating
      rating += 1;
      const notCreated = currentAllRatingData && !currentAllRatingData.inLibrary;
      const bookData = getBodyFromFilteredGoogleFields(data);

      const createBody = { bookData, rating };
      const updateBody = { rating };

      notCreated ? createMutation(createBody) : updateMutation(updateBody);
   };

   const handleRemoveMutation = () => {
      removeMutation(null);
   };

   return { handleMutation, handleRemoveMutation, currentRatingData };
}

type HandleRatingResult = ReturnType<typeof useHandleRating>;

export type { HandleRatingResult };
export default useHandleRating;
