import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Data, MutationAddCommentParams } from '../types/models/books';
import apiRequest from '@/utils/fetchData';
import API_ROUTES from '@/utils/apiRoutes';
import queryKeys from '@/utils/queryKeys';

export default function useMutateComment(params: MutationAddCommentParams) {
   const queryClient = useQueryClient();
   const { bookId, userId, pageIndex } = params;

   // TODO: if the user has already left a comment the user is only allowed to leave replies(?)
   //    if the user already left the comment then ask the user if they want to update the comment

   return useMutation(
      (data: { comment: string; data: Data }) => {
         const res = apiRequest({
            apiUrl: API_ROUTES.COMMENTS.ADD(userId, bookId),
            method: 'POST',
            data: data,
            shouldRoute: false,
         });

         return res;
      },
      {
         onSettled: (data) => {
            // console.log('THE DATA HERE IS: ', data);

            setTimeout(() => {
               console.log('Comment has been added and now should be invalidated');
               console.log('After the comment has been posted');
               queryClient.invalidateQueries(queryKeys.commentsByBook(bookId, pageIndex));
            }, 2500); // Adjust delay as necessary
         },
      }
   );
}

// probably not reply
// create, update comment, or reply to comment?
