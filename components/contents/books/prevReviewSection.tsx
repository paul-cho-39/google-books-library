import { useRef } from 'react';
import UserAvatar, { UserAvatarProps } from '../../icons/avatar';
import { Divider } from '@/components/layout/dividers';
import SectionHeader from '@/components/headers/sectionHeader';
import { useDisableBreakPoints } from '@/lib/hooks/useDisableBreakPoints';

interface PreviewReviewSectionProps {
   avatarUrl: string | null | undefined;
   scrollToElement: () => void;
}

const PreviewReviewSection = ({ avatarUrl, scrollToElement }: PreviewReviewSectionProps) => {
   const isScreenMid = useDisableBreakPoints();
   const size = !isScreenMid ? 40 : 50;
   return (
      <section id='Leave_reviews'>
         <Divider />
         {/* should be relative */}
         <SectionHeader title='Ratings & Reviews' />
         <div className='my-2 lg:my-4 flex flex-col gap-y-4 lg:gap-y-6 items-center justify-center'>
            {/* wrap this with another div tag? */}
            <UserAvatar avatarUrl={avatarUrl} size={{ width: size, height: size }} />
            <h3 className='font-semibold text-xl lg:text-2xl dark:text-slate-300 text-slate-800'>
               Share <i>your</i> thoughts
            </h3>
            <button
               className='inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-slate-300/40 text-indigo-100 hover:opacity-70'
               onClick={scrollToElement}
            >
               Write a Review
            </button>
         </div>
         <Divider />
      </section>
   );
};

export default PreviewReviewSection;
