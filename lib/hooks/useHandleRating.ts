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
   console.log('all rating data is: ', allRatingData);

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

   // whenever current data or all rating data changes it should update the function
   // const handleMutation = useCallback(
   //    (rating: number) => {
   //       // create a book based on all ratings not user book rating
   //       rating += 1;
   //       const notCreated = currentAllRatingData && !currentAllRatingData.inLibrary;
   //       const bookData = getBodyFromFilteredGoogleFields(data);
   //       const createBody = { bookData, rating };
   //       const updateBody = { rating };

   //       notCreated ? createMutation(createBody) : updateMutation(updateBody);
   //    },
   //    // eslint-disable-next-line react-hooks/exhaustive-deps
   //    [currentAllRatingData, currentRatingData]
   // );

   console.log('--------------INSIDE useHanldeRating----------');
   console.log('THE CURRENT RATING DATA IS :', currentAllRatingData);

   const handleMutation = (rating: number) => {
      // create a book based on all ratings not user book rating
      rating += 1;
      const notCreated = currentAllRatingData && !currentAllRatingData.inLibrary;
      const bookData = getBodyFromFilteredGoogleFields(data);

      const createBody = { bookData, rating };
      const updateBody = { rating };

      const apiRoute = notCreated ? 'index.ts' : 'update.ts';

      notCreated ? createMutation(createBody) : updateMutation(updateBody);
   };

   const handleRemoveMutation = () => {
      removeMutation(null);
   };

   console.log('IS LOADING', isRemoveLoading || isUpdateLoading || isCreateLoading);

   // use it without callback and see
   // const handleRemoveMutation = useCallback(() => {
   //    removeMutation(null);
   // }, [removeMutation]);

   return { handleMutation, handleRemoveMutation, currentRatingData };
}

export default useHandleRating;
