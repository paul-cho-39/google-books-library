import API_ROUTES from '@/utils/apiRoutes';
import apiRequest from '@/utils/fetchData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationBase, MutationCommentParams } from '../types/models/books';
import queryKeys from '@/utils/queryKeys';

export default function useMutateUpdateOrReply(
   params: MutationCommentParams,
   action: 'update' | 'reply'
) {
   const { bookId, pageIndex, parentId, userId, commentId } = params;
   const queryClient = useQueryClient();
   const url =
      action === 'update'
         ? API_ROUTES.COMMENTS.UPDATE_COMMENT(commentId.toString(), userId)
         : API_ROUTES.COMMENTS.REPLY(userId, bookId, parentId.toString());

   return useMutation(
      (data: { comment: string }) =>
         apiRequest({
            apiUrl: url,
            method: 'POST',
            data: data,
         }),
      {
         // on settle invalidate and refetch the comments again
         onSettled: () =>
            queryClient.invalidateQueries(queryKeys.commentsByBook(bookId, pageIndex.toString())),
      }
   );
}
