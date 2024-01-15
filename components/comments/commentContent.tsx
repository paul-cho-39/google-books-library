import { useEffect, useRef, useState } from 'react';
import UserAvatar, { UserAvatarProps } from '../icons/avatar';
import DisplayRating from '../bookcover/ratings';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { CommentPayload } from '@/lib/types/response';

type CommentContentProps = {
   content: string;
};

const MAX_HEIGHT = 145;
const TEXT_BASE = 1;

// if the description is too long then display show more
const CommentContent = ({ content }: CommentContentProps) => {
   const commentRef = useRef<HTMLDivElement>(null);
   const [isExpand, setExpand] = useState(false);
   const [showMore, setShowMore] = useState(false);

   useEffect(() => {
      if (!commentRef.current) return;

      if (commentRef.current?.clientHeight > MAX_HEIGHT) {
         setShowMore(true);
      }
   }, []);

   console.log('show more ?: ', showMore);

   return (
      // <div className='flex-1 sm:px-6 leading-relaxed dark:text-gray-300 bg-red-500'>
      //    <CommentName name={getUserName.byComment(comment)} {...props} />
      //    {/* stars and date */}
      //    <CommentInfo rating={rating} dateAdded={formatDate(comment.dateAdded)} />
      //    {/* post and grid */}
      //    {/* post will have set height and the full comment w/ differnet component */}
      <div className='py-1 my-1'>
         {/* what should be displayed here */}
         {showMore && isExpand ? (
            <div>
               <span>{content}</span>
            </div>
         ) : (
            // maybe set this in grid?
            <div
               ref={commentRef}
               className='relative my-2 py-4 max-h-44 overflow-hidden bg-green-100'
            >
               <p className='max-h-[8.4rem] text-base overflow-hidden bg-slate-300'>{content}</p>
               {showMore && (
                  <div>
                     <div className='absolute top-[7.6rem] h-14 w-full bg-gradient-to-b from-slate-100/5 to-[#ffffff] dark:from-slate-800/50 dark:to-slate-800'></div>

                     <div className='absolute z-30 left-0 w-full flex flex-row items-center'>
                        <button onClick={() => setExpand(true)} className='bg-blue-400'>
                           Show more
                        </button>
                        <ArrowRightIcon className='w-4 h-4 text-gray-800 dark:text-slate-300' />{' '}
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
      // </div>
   );
};

export default CommentContent;

// set a destinated height for each of the comment.
// When 'show more' expand the height so that it will fully cover the entire char length

interface CommentNameProps extends UserAvatarProps {
   name: string;
}

export const CommentName = ({ name, ...props }: CommentNameProps) => {
   return (
      <div className='w-full flex flex-row py-1 justify-start items-start bg-blue-300'>
         <UserAvatar {...props} />
         <h3 className='px-3'>
            <strong>{name}</strong> {/* display rating here */}
         </h3>
      </div>
   );
};

interface CommentInfoProps<T extends string | Date> {
   rating: number;
   dateAdded: T;
}

export const CommentInfo = ({ dateAdded, rating }: CommentInfoProps<string>) => {
   return (
      <div className='w-full flex mb-2 py-2 justify-between bg-teal-600'>
         <DisplayRating averageRating={rating} size='medium' displayText={false} />
         <span className='text-xs text-gray-400 '>{dateAdded}</span>
      </div>
   );
};
