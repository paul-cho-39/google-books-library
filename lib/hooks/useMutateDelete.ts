import API_ROUTES from '@/utils/apiRoutes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationBase, MutationCommentParams } from '../types/models/books';
import apiRequest from '@/utils/fetchData';
import queryKeys from '@/utils/queryKeys';

export default function useMutateDelete(params: MutationCommentParams) {
   const { bookId, commentId, userId, pageIndex } = params;
   const queryClient = useQueryClient();
   return useMutation(
      () =>
         apiRequest({
            apiUrl: API_ROUTES.COMMENTS.DELETE(userId, bookId, commentId.toString()),
            method: 'DELETE',
         }),
      {
         // on settle invalidate and refetch the comments again
         onSettled: () =>
            queryClient.invalidateQueries(queryKeys.commentsByBook(bookId, pageIndex.toString())),
      }
   );
}
