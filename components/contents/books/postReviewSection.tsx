import { FormEvent, ForwardRefRenderFunction, forwardRef, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import useMutateComment, { CustomStateType } from '@/lib/hooks/useMutateComment';
import { BaseIdParams, MutationAddCommentParams } from '@/lib/types/models/books';
import { getBodyFromFilteredGoogleFields } from '@/lib/helper/books/getBookBody';
import { Items } from '@/lib/types/googleBookTypes';
import { MAXIMUM_CONTENT_LENGTH } from '@/constants/inputs';
import DisplayWordCount from '@/components/comments/wordCount';
import Spinner from '@/components/loaders/spinner';

export interface PostReviewSectionProps<TParam extends MutationAddCommentParams | BaseIdParams> {
   params: TParam;
   bookData: Items<Record<string, string>>;
   scrollToDisplay: () => void;
}

const CUSTOM_LOADING_TIME = 1200;

const PostReviewSection: ForwardRefRenderFunction<
   HTMLElement,
   PostReviewSectionProps<MutationAddCommentParams>
> = (props, ref) => {
   // TODO: consider using react-hook-form for re-rendering effect
   const [comment, setComment] = useState('');
   const [customState, setCustomState] = useState<CustomStateType>('idle');

   const {
      mutate,
      isLoading: isMutateLoading,
      isError,
   } = useMutateComment(props.params, customState, setCustomState, props.scrollToDisplay);

   // write a hook so that it can be used for 1) replying 2) updating
   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (comment.length < 1 || comment.length > MAXIMUM_CONTENT_LENGTH) return;

      setCustomState('loading');
      try {
         const data = getBodyFromFilteredGoogleFields(props.bookData);
         const body = { data, comment: comment };

         mutate(body);
      } catch (err) {
         console.error('Error trying to post a comment', err);
      } finally {
         setComment('');
      }
   };

   useEffect(() => {
      if (customState === 'loading') {
      }
   }, [customState]);

   const isLoading = customState === 'loading' || isMutateLoading;
   // const isLoading = customLoading || mutateLoading;

   // TODO: an option to leave the review here too
   return (
      <section id='reviews' ref={ref}>
         <div className='relative max-w-2xl bg-white dark:bg-gray-400/10 rounded-lg border-none pt-4 mx-auto mt-20 text-slate-800 dark:text-slate-200'>
            <div className='absolute px-2 top-0 bg-white dark:bg-slate-800 rounded-tl-lg rounded-br-lg'>
               <h4 className='text-md font-semibold text-gray-800 dark:text-white'>Review</h4>
            </div>

            {/* break this into another component so that it can be used again here */}
            <form onSubmit={handleSubmit}>
               <div className='w-full px-3 mb-2 mt-6'>
                  <textarea
                     className='bg-gray-100 dark:bg-gray-600 rounded border border-gray-400 w-full h-28 p-3 font-medium placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-bg-gray-600'
                     name='body'
                     placeholder='Your Review'
                     value={comment}
                     onChange={(e) => setComment(e.target.value)}
                  ></textarea>
               </div>
               <div className='w-full flex justify-end px-4 my-4'>
                  <button
                     type='submit'
                     disabled={isLoading}
                     className='px-2.5 py-1.5 rounded-lg text-lg text-gray-800 dark:text-white bg-beige dark:bg-charcoal'
                  >
                     {isLoading ? <Spinner size='sm' color='indigo' /> : 'Post'}
                  </button>
               </div>
            </form>
            <DisplayWordCount comment={comment} />
         </div>
      </section>
   );
};

export default forwardRef(PostReviewSection);
