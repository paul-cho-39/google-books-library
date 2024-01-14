import { Suspense, lazy, useState } from 'react';
import { CommentPayload } from '@/lib/types/response';
import UserAvatar, { UserAvatarProps } from '../icons/avatar';
import CommentContent from './commentContent';
import { getUserName } from '@/lib/helper/getUserId';
import Reply from './replies';
import Spinner from '../loaders/spinner';
import CommentActionWrapper from './commentAction';
import {
   BaseIdParams,
   MutationCommentParams,
   MutationUpvoteParams,
} from '@/lib/types/models/books';
import useMutateUpvote from '@/lib/hooks/useMutateUpvote';
import useHandleComments from '@/lib/hooks/useHandleComments';

export interface CommentProps<TParams extends BaseIdParams | MutationCommentParams>
   extends UserAvatarProps {
   rating: number;
   comment: CommentPayload;
   params: TParams;
}

// wrap this with larger comments[] and if it is undefined then it should return NO COMMNET
const Comment = ({ comment, params, rating, ...props }: CommentProps<MutationCommentParams>) => {
   const [displayReply, setDiplayReply] = useState(false);
   const [showDelete] = useState(comment.userId === params.userId);

   const { mutate } = useMutateUpvote(params);
   const { updateComment, replyComment, deleteComment } = useHandleComments(params);

   const showDisplayReply = () => {
      setDiplayReply(true);
   };

   const handleUpvote = () => {
      mutate();
   };

   return (
      <article aria-roledescription='review' className='space-y-4'>
         <div className='px-2 flex'>
            {/* users rating data should be written here */}
            <CommentContent
               rating={rating}
               name={getUserName.byComment(comment)}
               dateAdded={comment.dateAdded}
               dateUpdated={comment?.dateUpdated}
               content={comment.content}
               {...props}
            />
            <CommentActionWrapper
               upvoteCount={comment?.upvoteCount || 0}
               deleteComment={() => deleteComment.mutate()}
               replyCount={comment?.count?.replies || 0}
               displayReplyComment={showDisplayReply}
               showDelete={showDelete}
               upvote={handleUpvote}
            />
            {/* TODOS: */}
            {/* have 'show replies' here */}
            {displayReply && comment.replies && comment.replies.length > 0 && (
               <>
                  <h4 className='my-5 uppercase tracking-wide text-gray-400 font-bold text-xs'>
                     Replies
                  </h4>
                  <div className='space-y-4'>
                     {comment.replies.map((reply) => (
                        <Reply
                           key={reply.id}
                           reply={reply}
                           name={getUserName.byReplies(reply)}
                           {...props}
                        />
                     ))}
                  </div>
               </>
            )}
         </div>
      </article>
   );
};

export default Comment;
