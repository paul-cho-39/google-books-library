import { Dispatch, SetStateAction } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Data, MutationAddCommentParams } from '../types/models/books';
import apiRequest from '@/utils/fetchData';
import API_ROUTES from '@/utils/apiRoutes';
import queryKeys from '@/utils/queryKeys';
import { AddedCommentResponseData } from '../types/response';
import poll from '../helper/poll';

export type CustomStateType = 'idle' | 'error' | 'loading' | 'success';

export default function useMutateComment(
   params: MutationAddCommentParams,
   customState: CustomStateType,
   setCustomState: Dispatch<SetStateAction<CustomStateType>>,
   scrollToDisplaySection: () => void
) {
   const queryClient = useQueryClient();
   // const [customState, setCustomState] = useState<CustomStateType>('idle');
   const { bookId, userId, pageIndex } = params;

   // TODO: if the user has already left a comment the user is only allowed to leave replies(?)
   //    if the user already left the comment then ask the user if they want to update the comment

   const { mutate, isLoading, isError } = useMutation(
      async (data: { comment: string; data: Data }) => {
         const res = (await apiRequest({
            apiUrl: API_ROUTES.COMMENTS.ADD(userId, bookId),
            method: 'POST',
            data: data,
            shouldRoute: false,
         })) as AddedCommentResponseData;

         return res;
      },
      {
         onSuccess: ({ data }) => {
            poll.pollNewComment({
               data,
               bookId,
               pageIndex,
               setState: setCustomState,
               queryClient,
            });
            if (customState === 'idle' || customState === 'success') {
               scrollToDisplaySection();
            }
         },
         onSettled: (data) => {
            queryClient.invalidateQueries(queryKeys.commentsByBook(bookId, pageIndex));
         },
      }
   );

   return { mutate, isLoading, isError };
}

// probably not reply
// create, update comment, or reply to comment?
