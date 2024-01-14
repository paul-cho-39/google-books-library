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

interface ReviewSectionProps extends PostReviewSectionProps<BaseIdParams> {
   // bookId: string;
   rating: number;
   avatarUrl: UserAvatarProps['avatarUrl'];
}

const ReviewSection = ({ rating, avatarUrl, ...props }: ReviewSectionProps) => {
   const [pageIndex, setPageIndex] = useState(1); // pagination for comments
   const postReviewRef = useRef<HTMLElement>(null);
   const isScreenMid = useDisableBreakPoints();

   const params = { ...props.params, pageIndex };
   const AVATAR_SIZE = !isScreenMid ? 25 : 30;

   // notifyOnChanges whenever the pageIndex is changed(?) -- but why?

   // this is required in order for it to assign mutationParams(?)
   const reviewResult = useGetReviews(props.params.bookId, pageIndex);

   // scroll to comment from previewReviewSection to postReviewSection
   const scrollToComment = () => {
      if (postReviewRef.current) {
         postReviewRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   };
   return (
      <div className='lg:my-6 my-4' id='reviews'>
         <PreviewReviewSection
            scrollToElement={scrollToComment}
            avatarUrl={avatarUrl}
            size={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
         />
         {/* lazy load this component */}
         {/* reply, upvote, update, delete */}
         <DisplayReviewSection
            reviewsReuslt={reviewResult}
            avatarUrl={avatarUrl}
            size={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            scrollToComment={scrollToComment}
            params={params}
            pageIndex={pageIndex}
            rating={rating}
         />

         {/* add comment here */}
         <PostReviewSection ref={postReviewRef} bookData={props.bookData} params={params} />
      </div>
   );
};

export default ReviewSection;
