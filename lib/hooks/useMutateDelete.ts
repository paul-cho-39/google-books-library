import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import API_ROUTES from '@/utils/apiRoutes';
import { MutationBase, MutationCommentParams } from '../types/models/books';
import apiRequest from '@/utils/fetchData';
import queryKeys from '@/utils/queryKeys';
import TOAST_MESSAGE from '@/constants/toast';

export default function useMutateDelete(params: MutationCommentParams) {
   const { bookId, commentId, userId, pageIndex } = params;
   const queryClient = useQueryClient();
   const mutation = useMutation(
      () =>
         apiRequest({
            apiUrl: API_ROUTES.COMMENTS.DELETE(userId, bookId, commentId.toString()),
            method: 'DELETE',
         }),
      {
         onError: (err) => {
            console.error('Error while deleting comment :', err);
            toast.error(TOAST_MESSAGE.comment.delete.error);
         },
         // onSuccess: (data, _, context) => {
         //    toast.success(TOAST_MESSAGE.comment.delete.sucess);
         // },
         // on settle invalidate and refetch the comments again
         onSettled: () =>
            queryClient.invalidateQueries(queryKeys.commentsByBook(bookId, pageIndex.toString())),
      }
   );

   const { status } = mutation;

   // introducing manual toast instead of mutation callback because it won't sync properly
   useEffect(() => {
      if (status === 'success') {
         console.log('SUCCCESSSFULLLL!');
         toast.success(TOAST_MESSAGE.comment.delete.success);
      } else if (status === 'error') {
         toast.error(TOAST_MESSAGE.comment.delete.error);
      }
   }, [status]);

   return mutation;
}
