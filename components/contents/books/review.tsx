import SectionHeader from '@/components/headers/sectionHeader';
import { useRef, useState } from 'react';
import PreviewReviewSection from './prevReviewSection';
import PostReviewSection, { PostReviewSectionProps } from './postReviewSection';
import { UserAvatarProps } from '@/components/icons/avatar';
import { useDisableBreakPoints } from '@/lib/hooks/useDisableBreakPoints';
import DisplayReviewSection from './displayReviewSection';
import { BaseIdParams, MutationCommentParams } from '@/lib/types/models/books';
import useHandleComments from '@/lib/hooks/useHandleComments';
import useGetReviews from '@/lib/hooks/useGetReviews';

interface ReviewSectionProps extends Omit<PostReviewSectionProps<BaseIdParams>, 'scrollToDisplay'> {
   // bookId: string;
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

   // notifyOnChanges whenever the pageIndex is changed(?) -- but why?

   // this is required in order for it to assign mutationParams(?)
   const reviewResult = useGetReviews(props.params.bookId, pageIndex);

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
   return (
      <div className='lg:my-6 my-4' id='reviews'>
         <PreviewReviewSection
            scrollToElement={() => scrollToComment('post')}
            avatarUrl={avatarUrl}
            size={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
         />
         {/* lazy load this component */}
         {/* reply, upvote, update, delete */}
         <DisplayReviewSection
            ref={displayReviewRef}
            reviewsReuslt={reviewResult}
            currentUserName={currentUserName}
            avatarUrl={avatarUrl}
            size={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            scrollToComment={() => scrollToComment('post')}
            params={params}
            pageIndex={pageIndex}
            // rating={rating}
         />

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
