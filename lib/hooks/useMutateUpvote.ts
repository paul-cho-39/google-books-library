import API_ROUTES from '@/utils/apiRoutes';
import apiRequest from '@/utils/fetchData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentPayload, UpvotePayload } from '../types/response';
import queryKeys from '@/utils/queryKeys';

interface MutationUpvoteParams {
   userId: string;
   bookId: string;
   commentId: number;
   pageIndex: string;
   idx: number;
}

function useMutateUpvote({ userId, bookId, commentId, pageIndex, idx }: MutationUpvoteParams) {
   const queryClient = useQueryClient();

   return useMutation(
      () =>
         apiRequest({
            apiUrl: API_ROUTES.COMMENTS.UPVOTE(userId, bookId, idx.toString()),
            method: 'PATCH',
            shouldRoute: false,
         }),
      {
         onMutate: async () => {
            await queryClient.cancelQueries(queryKeys.commentsByBook(bookId, pageIndex));

            const prevComments = queryClient.getQueryData<CommentPayload[]>(
               queryKeys.commentsByBook(bookId, pageIndex)
            );

            // if there is no comments, users cannot upvote
            if (prevComments) {
               queryClient.setQueryData<CommentPayload[]>(
                  queryKeys.commentsByBook(bookId, pageIndex),
                  setOptimisticData(prevComments, commentId, userId)
               );
            }

            return { prevComments };
         },
         onError: (err, commentId, context) => {
            // Rollback on error
            if (context?.prevComments) {
               queryClient.setQueryData(
                  queryKeys.commentsByBook(bookId, pageIndex),
                  context?.prevComments
               );
            }
            // return toast if an error happens
         },
         onSettled: () => {
            queryClient.invalidateQueries(queryKeys.commentsByBook(bookId, pageIndex));
         },
      }
   );
}

function setOptimisticData(
   comments: CommentPayload[],
   commentId: number,
   userId: string
): CommentPayload[] {
   // if (!comments) return;  // no comments

   return comments.map((comment) => {
      if (comment.id === commentId) {
         const userUpvoteIndex = comment.upvote.findIndex((upvote) => upvote.userId === userId);
         let updatedUpvotes = [...comment.upvote];
         let updatedUpvoteCount = comment.upvoteCount;

         if (userUpvoteIndex > -1) {
            // user has already upvoted, so remove their upvote
            updatedUpvotes.splice(userUpvoteIndex, 1);
            updatedUpvoteCount--;
         } else {
            // user hasn't upvoted yet, so add their upvote

            // find the max then upvote
            const tempId = Math.max(0, ...comment.upvote.map((u) => u.id));
            const newUpvote: UpvotePayload[number] = { id: tempId, upvoteId: comment.id, userId };
            updatedUpvotes.push(newUpvote);
            updatedUpvoteCount++;
         }

         return {
            ...comment,
            upvote: updatedUpvotes,
            upvoteCount: updatedUpvoteCount,
         };
      } else if (comment.replies) {
         // recursively update replies
         return {
            ...comment,
            replies: setOptimisticData(comment.replies, commentId, userId),
         };
      }
      return comment;
   });
}
