import SectionHeader from '@/components/headers/sectionHeader';
import { useRef } from 'react';
import PreviewReviewSection from './prevReviewSection';
import PostReviewSection, { PostReviewSectionProps } from './postReviewSection';
import { UserAvatarProps } from '@/components/icons/avatar';

interface ReviewSectionProps extends PostReviewSectionProps {
   avatarUrl: UserAvatarProps['avatarUrl'];
}

const ReviewSection = ({ avatarUrl, ...props }: ReviewSectionProps) => {
   const postReviewRef = useRef<HTMLElement>(null);

   const scrollToComment = () => {
      if (postReviewRef.current) {
         postReviewRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   };
   return (
      <div className='lg:my-6 my-4' id='reviews'>
         <PreviewReviewSection scrollToElement={scrollToComment} avatarUrl={avatarUrl} />
         <PostReviewSection ref={postReviewRef} {...props} />
      </div>
   );
};

export default ReviewSection;
