import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Data, MutationBase } from '../types/models/books';
import apiRequest from '@/utils/fetchData';
import API_ROUTES from '@/utils/apiRoutes';

interface MutationCommentParams extends MutationBase {
   comment: string;
}

export default function useMutateComment(params: Omit<MutationBase, 'prevRatingData'>) {
   const { bookId, userId, inLibrary } = params;

   // TODO: if the user has already left a comment the user is only allowed to leave replies(?)
   //    if the user already left the comment then ask the user if they want to update the comment

   return useMutation((data: { comment: string; data: Data }) =>
      apiRequest({
         apiUrl: API_ROUTES.COMMENTS.ADD(userId, bookId),
         method: 'POST',
         data: data,
         shouldRoute: false,
      })
   );
}

// probably not reply
// create, update comment, or reply to comment?
