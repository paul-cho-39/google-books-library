import { UserAvatarProps } from '@/components/icons/avatar';
import useGetReviews from '@/lib/hooks/useGetReviews';
import { CommentPayload, ErrorResponse } from '@/lib/types/response';
import Comment, { CommentProps } from '@/components/comments/comment';
import { ForwardRefRenderFunction, forwardRef, useState } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import getMutationParams from '@/lib/helper/getCommentMutationParams';
import { BaseIdParams } from '@/lib/types/models/books';

interface DisplayReviewSectionProps extends Omit<CommentProps<BaseIdParams>, 'comment'> {
   reviewsReuslt: UseQueryResult<CommentPayload[], ErrorResponse>;
   pageIndex: number;
   scrollToComment: () => void;
}

const DisplayReviewSection: ForwardRefRenderFunction<HTMLDivElement, DisplayReviewSectionProps> = (
   props,
   ref
) => {
   const { scrollToComment, reviewsReuslt, pageIndex, ...rest } = props;
   // TODO: add isLoading & isError for more responsive state
   //    TODO: add total number of comments
   const { data: reviews, isLoading, isError } = reviewsReuslt;

   return (
      <section id='display_review'>
         <div ref={ref} className='py-6'>
            {!reviews ? (
               <NoCommentToDisplay scrollToComment={scrollToComment} />
            ) : (
               <div className='flex flex-col my-6 gap-y-12'>
                  {reviews.map((review) => (
                     <Comment
                        {...rest}
                        params={getMutationParams(review, props.params, pageIndex)}
                        key={review.id}
                        comment={review}
                     />

                     // if the user replies
                  ))}
               </div>
            )}
         </div>
      </section>
   );
};

const NoCommentToDisplay = (props: Pick<DisplayReviewSectionProps, 'scrollToComment'>) => {
   return (
      <div className='py-24 flex items-center justify-center'>
         <p className='text-xl lg:text-2xl'>
            Review is so empty. Be the first to{' '}
            <span
               role='navigation'
               onClick={props.scrollToComment}
               className='underline underline-offset-2 cursor-pointer'
            >
               review!
            </span>
         </p>
      </div>
   );
};

export default forwardRef(DisplayReviewSection);
