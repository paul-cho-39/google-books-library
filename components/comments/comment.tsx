import { Suspense, lazy, useState } from 'react';
import { CommentPayload } from '@/lib/types/response';
import UserAvatar, { UserAvatarProps } from '../icons/avatar';
import CommentContent, { CommentInfo, CommentName } from './commentContent';
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
import { formatDate } from '@/lib/helper/books/formatBookDate';

export interface CommentProps<TParams extends BaseIdParams | MutationCommentParams>
   extends UserAvatarProps {
   rating: number;
   comment: CommentPayload;
   params: TParams;
}

// wrap this with larger comments[] and if it is undefined then it should return NO COMMNET
const Comment = ({ comment, params, rating, ...props }: CommentProps<MutationCommentParams>) => {
   const [displayReply, setDiplayReply] = useState(false);
   const [showDelete, setDelete] = useState({
      displayIcon: comment.userId === params.userId,
      displayDelete: false,
   });

   const { mutate: upvote } = useMutateUpvote(params);
   const { updateComment, replyComment, deleteComment } = useHandleComments(params);

   const showDisplayReply = () => {
      setDiplayReply(true);
   };

   const handleUpvote = () => {
      upvote();
   };

   return (
      <article aria-roledescription='review' className='space-y-4'>
         <div className='px-2 flex'>
            <div className='flex-1 sm:px-6 leading-relaxed dark:text-gray-300 bg-red-500'>
               {/* avatar and name */}
               <CommentName name={getUserName.byComment(comment)} {...props} />

               {/* stars and date */}
               <CommentInfo rating={rating} dateAdded={formatDate(comment.dateAdded)} />

               {/* comment content */}
               <CommentContent content={comment.content} />

               {/* comment display and action button */}
               <CommentActionWrapper
                  upvoteCount={comment?.upvoteCount || 0}
                  replyCount={comment?._count?.replies || 0}
                  displayReplyComment={showDisplayReply}
                  upvote={handleUpvote}
                  showDelete={showDelete.displayIcon}
                  deleteComment={() => {
                     setDelete({
                        ...showDelete,
                        displayDelete: true,
                     });
                  }}
               />
            </div>
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
