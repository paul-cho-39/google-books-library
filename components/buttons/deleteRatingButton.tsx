import React from 'react';
import { SingleRatingData } from '@/lib/types/serverTypes';
import useMutateRatings from '@/lib/hooks/useMutateRating';
import { PencilIcon } from '@heroicons/react/20/solid';

export type DeleteRatingButtonProps = {
   handleRemoveMutation: () => void;
   shouldDisplay: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

function DeleteRatingButton({
   handleRemoveMutation,
   shouldDisplay,
   ...buttonProps
}: DeleteRatingButtonProps) {
   if (!shouldDisplay) {
      return null;
   }

   return (
      <>
         <PencilIcon aria-hidden className='h-6 w-6 text-slate-800 dark:text-slate-200' />
         <button
            {...buttonProps}
            onClick={handleRemoveMutation}
            aria-label='delete rating'
            className='bg-transparent font-medium text-lg text-slate-800 dark:text-slate-200 hover:underline focus:outline-none'
         >
            Delete Rating
         </button>
      </>
   );
}

export default DeleteRatingButton;
