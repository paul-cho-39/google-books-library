import { MutationCommentParams } from '../types/models/books';
import useMutateComment from './useMutateComment';
import useMutateDelete from './useMutateDelete';
import useMutateUpdateOrReply from './useMutateReply';

type CommentActionType = 'update' | 'reply' | 'delete';

/**
 * Hook store for distributing comments action. The store contains add, delete, update, and reply to comments.
 * @param {MutationCommentParams} params - The parameters needed for comment mutations.
 *   These include bookId, commentId, userId, and other relevant data.
 * @returns {Object} An object containing the following properties:
 *   - deleteComment: A mutation hook for deleting an existing comment.
 *   - updateComment: A mutation hook for updating an existing comment.
 *   - replyComment: A mutation hook for replying to an existing comment.
 */

export default function useHandleComments(params: MutationCommentParams) {
   const deleteComment = useMutateDelete(params);
   const updateComment = useMutateUpdateOrReply(params, 'update');
   const replyComment = useMutateUpdateOrReply(params, 'reply');

   return { deleteComment, updateComment, replyComment };
}
