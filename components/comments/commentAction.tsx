import { Dispatch, SetStateAction } from 'react';
import useMutateReply from '@/lib/hooks/useMutateReply';
import useMutateUpvote from '@/lib/hooks/useMutateUpvote';
import { ChatBubbleBottomCenterIcon, HandThumbUpIcon, TrashIcon } from '@heroicons/react/20/solid';

type CommmentActionDisplayProps = {
   replyCount: number;
   upvoteCount: number;
};

// upvote && reply is a mutation call from useMutation
type CommmentActionProps = {
   showDelete: boolean;
   deleteComment: () => void;
   upvote: () => void;
   displayReplyComment: () => void;
};

type CommentWrapperProps = CommmentActionDisplayProps & CommmentActionProps;

const CommentActionWrapper = ({ replyCount, upvoteCount, ...props }: CommentWrapperProps) => {
   return (
      <div className='flex gap-y-1'>
         <CommentActionDisplay replyCount={replyCount} upvoteCount={upvoteCount} />
         <CommentAction {...props} />
      </div>
   );
};

const CommentActionDisplay = ({ replyCount, upvoteCount }: CommmentActionDisplayProps) => {
   return (
      <div className='flex flex-row gap-x-2 text-opacity-80 dark:text-slate-300 text-black'>
         <span>{upvoteCount} likes</span>
         {/* only display when reply is more than 0 */}
         {replyCount > 0 && <span>{replyCount} comment</span>}
         <span></span>
      </div>
   );
};

const CommentAction = ({
   upvote,
   deleteComment,
   displayReplyComment,
   showDelete,
}: CommmentActionProps) => {
   return (
      <div className='flex flex-row gap-x-2 font-semibold'>
         <button onClick={upvote}>
            <HandThumbUpIcon className='w-4 h-4' />
            <span>Like</span>
         </button>
         <button onClick={displayReplyComment}>
            <ChatBubbleBottomCenterIcon className='w-4 h-4' />
            <span>Comment</span>
         </button>
         {/* delete component if userId === comment.userId */}
         {showDelete && (
            <button onClick={deleteComment} aria-label='Delete comment'>
               <TrashIcon className='w-4 h-4' />
               <span>Delete</span>
            </button>
         )}
      </div>
   );
};

export default CommentActionWrapper;
