import { Suspense, lazy, useState } from 'react';

import { CommentPayload } from '@/lib/types/response';
import { UserAvatarProps } from '../icons/avatar';
import CommentContent, { CommentInfo, CommentName } from './commentContent';
import { getUserName } from '@/lib/helper/getUserId';
import CommentReplies from './commentReplies';
import CommentActionWrapper from './commentAction';
import {
   BaseIdParams,
   MutationCommentParams,
   MutationUpvoteParams,
} from '@/lib/types/models/books';
import useMutateUpvote from '@/lib/hooks/useMutateUpvote';
import useHandleComments from '@/lib/hooks/useHandleComments';
import { formatDate } from '@/lib/helper/books/formatBookDate';
import { Divider } from '../layout/dividers';

export interface CommentProps<TParams extends BaseIdParams | MutationCommentParams>
   extends UserAvatarProps {
   rating: number;
   comment: CommentPayload;
   currentUserName: string;
   params: TParams;
}

// wrap this with larger comments[] and if it is undefined then it should return NO COMMNET
const Comment = ({
   comment,
   params,
   currentUserName,
   rating,
   ...props
}: CommentProps<MutationCommentParams>) => {
   const { avatarUrl: currentUserAvatar, ...rest } = props;
   // user by comment NOT current user
   const userByComment = getUserName.byComment(comment);

   const [displayReply, setDiplayReply] = useState(false);
   const [showDelete, setDelete] = useState({
      displayIcon: comment.userId === params.userId,
      displayDelete: false,
   });

   const { mutate: upvote } = useMutateUpvote(params);
   const { updateComment, deleteComment } = useHandleComments(params);
   const { mutate: mutateDelete } = deleteComment;

   // if replies are to be shown by event-based the logic should be included here to display replies
   const showDisplayReply = () => {
      setDiplayReply(true);
   };

   const handleUpvote = () => {
      upvote();
   };

   const handleDeleteComment = () => {};

   return (
      <article
         className='border-t border-spacing-1 border-gray-500 dark:border-gray-400'
         aria-roledescription='review'
      >
         <div className='px-2 py-2 flex '>
            <div className='flex-1 sm:px-6 leading-relaxed dark:text-gray-300'>
               {/* avatar and name */}
               <CommentName
                  name={userByComment.name}
                  avatarUrl={userByComment.userImage}
                  {...rest}
               />

               {/* stars and date */}
               <CommentInfo
                  className='mb-2 py-2'
                  rating={rating}
                  dateAdded={formatDate(comment.dateAdded)}
               />

               {/* comment content */}
               <CommentContent content={comment.content} className='my-2 py-2' />

               {/* comment display and action button */}
               <CommentActionWrapper
                  upvoteCount={comment?.upvoteCount || 0}
                  replyCount={comment?._count?.replies || 0}
                  replyToComment={showDisplayReply}
                  upvote={handleUpvote}
                  showDelete={showDelete.displayIcon}
                  deleteComment={() => {
                     setDelete({
                        ...showDelete,
                        displayDelete: true, // display modal
                     });
                  }}
               />
            </div>
         </div>

         {/* TODOS: */}
         {/* have 'show replies' here */}

         {displayReply && (
            <div className='my-4'>
               <Divider />
               {/* show comments here and the ability to reply here */}
               <CommentReplies
                  params={params}
                  currentUserName={currentUserName}
                  replies={comment.replies}
                  {...props}
               />
            </div>
         )}
      </article>
   );
};

export default Comment;
