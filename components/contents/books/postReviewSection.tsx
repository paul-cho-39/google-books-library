import { FormEvent, ForwardRefRenderFunction, forwardRef, useEffect, useState } from 'react';
import useMutateComment, { CustomStateType } from '@/lib/hooks/useMutateComment';
import { BaseIdParams, MutationAddCommentParams, NewCommentBody } from '@/lib/types/models/books';
import { Items } from '@/lib/types/googleBookTypes';
import CreateComment from '@/components/comments/createComment';

export interface PostReviewSectionProps<TParam extends MutationAddCommentParams | BaseIdParams> {
   params: TParam;
   bookData: Items<Record<string, string>>;
   scrollToDisplay: () => void;
}

const PostReviewSection: ForwardRefRenderFunction<
   HTMLElement,
   PostReviewSectionProps<MutationAddCommentParams>
> = (props, ref) => {
   const { mutate, isLoading, isError } = useMutateComment(
      props.params,
      props.scrollToDisplay,
      'comment'
   );

   const handleMutation = (body: NewCommentBody) => {
      mutate(body);
   };

   return (
      <section id='reviews' ref={ref}>
         <div className='relative max-w-2xl bg-white dark:bg-gray-400/10 rounded-lg border-none pt-4 mx-auto mt-20 text-slate-800 dark:text-slate-200'>
            <div className='absolute px-2 top-0 bg-white dark:bg-slate-800 rounded-tl-lg rounded-br-lg'>
               <h4 className='text-md font-semibold text-gray-800 dark:text-white'>Review</h4>
            </div>

            <CreateComment
               bookData={props.bookData}
               mutate={handleMutation}
               placeholder='Write your Review'
               isLoading={isLoading}
               containerClassName='mt-3 md:mt-4 px-3'
               className='h-32 p-2 lg:p-3'
            />
         </div>
      </section>
   );
};

export default forwardRef(PostReviewSection);
