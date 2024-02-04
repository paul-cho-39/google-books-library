import { Suspense, lazy, useRef, useState } from 'react';
import PreviewReviewSection from './prevReviewSection';
import PostReviewSection, { PostReviewSectionProps } from './postReviewSection';
import { UserAvatarProps } from '@/components/icons/avatar';
import { useDisableBreakPoints } from '@/lib/hooks/useDisableBreakPoints';
import { BaseIdParams, MutationCommentParams } from '@/lib/types/models/books';
import Spinner from '@/components/loaders/spinner';

const LazyDisplayReviewSection = lazy(() => import('./displayReviewSection'));

interface ReviewSectionProps extends Omit<PostReviewSectionProps<BaseIdParams>, 'scrollToDisplay'> {
   // rating: number;
   avatarUrl: UserAvatarProps['avatarUrl'];
   currentUserName: string;
}

const ReviewSection = ({
   // rating,
   avatarUrl,
   currentUserName,
   ...props
}: ReviewSectionProps) => {
   const [pageIndex, setPageIndex] = useState(1); // pagination for comments
   const postReviewRef = useRef<HTMLElement>(null);
   const displayReviewRef = useRef<HTMLDivElement>(null);
   const isScreenMid = useDisableBreakPoints();

   const params = { ...props.params, pageIndex };
   const AVATAR_SIZE = !isScreenMid ? 30 : 35;

   // TODO: rewrite this function so that once the comment is posted it will scroll to the comment section
   // scroll to comment from previewReviewSection to postReviewSection
   const scrollToComment = (action: 'post' | 'display') => {
      if (action === 'post') {
         if (postReviewRef.current) {
            postReviewRef.current.scrollIntoView({ behavior: 'smooth' });
         }
      } else if (action === 'display' && displayReviewRef.current) {
         const elementRect = displayReviewRef.current.getBoundingClientRect();
         const top = elementRect.top + window.scrollY;
         window.scrollTo({ top, behavior: 'smooth' });
      }
   };

   const handlePageChange = (newPage: number, type?: 'next' | 'prev') => {
      const apiPageIndex = newPage;

      setPageIndex(newPage);

      switch (type) {
         case 'next':
            setPageIndex((prev) => prev + 1);
            break;
         case 'prev':
            setPageIndex((prev) => prev - 1);
            break;
         default:
            setPageIndex(apiPageIndex * 1);
            break;
      }
   };

   return (
      <div className='lg:my-6 my-4' id='reviews'>
         <PreviewReviewSection
            scrollToElement={() => scrollToComment('post')}
            avatarUrl={avatarUrl}
            size={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
         />
         {/* lazy load this component */}
         {/* reply, upvote, update, delete */}
         <Suspense fallback={<Spinner />}>
            <LazyDisplayReviewSection
               ref={displayReviewRef}
               currentUserName={currentUserName}
               avatarUrl={avatarUrl}
               size={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
               scrollToComment={() => scrollToComment('post')}
               params={params}
               handlePageChange={handlePageChange}
               pageIndex={pageIndex}
               // rating={rating}
            />
         </Suspense>

         {/* add comment here */}
         <PostReviewSection
            ref={postReviewRef}
            scrollToDisplay={() => scrollToComment('display')}
            bookData={props.bookData}
            params={params}
         />
      </div>
   );
};

export default ReviewSection;

// 1) set rating
// 2) add pagination
// 3) change description length
