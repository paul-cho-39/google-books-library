import { CommentPayload } from '@/lib/types/response';
import UserAvatar, { UserAvatarProps } from '../icons/avatar';
import CommentContent from './commentContent';

interface ReplyProps extends UserAvatarProps {
   reply: CommentPayload;
   name: string;
}

const Reply = ({ reply, name, ...props }: ReplyProps) => {
   return (
      <div className='flex'>
         <div className='flex-shrink-0 mr-3'>
            <UserAvatar {...props} />
         </div>
         <CommentContent
            name={name}
            dateAdded={reply.dateAdded}
            dateUpdated={reply.dateUpdated}
            content={reply.content}
            {...props}
         />
      </div>
   );
};

export default Reply;
