import React from 'react';
import { SingleRatingData } from '@/lib/types/serverTypes';
import useMutateRatings from '@/lib/hooks/useMutateRating';
import { PencilIcon } from '@heroicons/react/20/solid';

type DeleteRatingButtonProps = {
   bookId: string;
   userId: string;
   // this is optional but when removing the data has to be there, hence why its required
   initialData: SingleRatingData;
   shouldDisplay: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

function DeleteRatingButton({
   bookId,
   userId,
   initialData,
   shouldDisplay,
   ...buttonProps
}: DeleteRatingButtonProps) {
   const {
      mutation: { mutate },
   } = useMutateRatings(
      {
         bookId,
         userId,
         initialData,
      },
      'remove'
   );

   if (!shouldDisplay) {
      return null;
   }

   const handleDelete = () => {
      mutate(null);
   };

   return (
      <>
         <PencilIcon className='h-6 w-6 text-slate-800 dark:text-slate-200' />
         <button
            {...buttonProps}
            onClick={handleDelete}
            aria-label='delete rating'
            className='bg-transparent font-medium text-lg text-slate-800 dark:text-slate-200 hover:underline focus:outline-none'
         >
            Delete Rating
         </button>
      </>
   );
}

export default DeleteRatingButton;
