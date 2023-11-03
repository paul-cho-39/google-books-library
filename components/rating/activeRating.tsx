import { Dispatch, useState, SetStateAction } from 'react';
import Star, { Size } from '../icons/starIcon';
import DeleteRatingButton, { DeleteRatingButtonProps } from '../buttons/deleteRatingButton';

export type ActiveRatingProps = {
   ratingTitle: string;
   selectedRating: number | null;
   setSelectedRating: Dispatch<SetStateAction<number | null>>;
   handleMutation: (rating: number) => void;
   size?: Size;
} & DeleteRatingButtonProps;

export const ActiveRating = ({
   ratingTitle,
   shouldDisplay,
   handleRemoveMutation,
   selectedRating,
   setSelectedRating,
   handleMutation,
   size = 'small',
}: ActiveRatingProps) => {
   const [hoveredStar, setHoveredStar] = useState<number | null>(null);

   const adjustRating = (num: number) => {
      return num + 1;
   };

   const handleMouseEnter = (index: number) => {
      setHoveredStar(adjustRating(index));
   };

   const handleMouseLeave = () => {
      setHoveredStar(null);
   };

   //   may have to change this logic here
   const handleClick = (rating: number) => {
      const adjustedRating = adjustRating(rating);
      setSelectedRating(adjustedRating);
      handleMutation(rating);
   };

   const getFillPercentage = (index: number) => {
      if (hoveredStar !== null) {
         return adjustRating(index) <= hoveredStar ? 100 : 0;
      } else if (selectedRating !== null) {
         return adjustRating(index) <= selectedRating ? 100 : 0;
      }
      return 0;
   };

   return (
      <div className='flex flex-col'>
         <div className='flex flex-row cursor-pointer'>
            {Array.from({ length: 5 }).map((_, index) => (
               <div
                  key={index}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(index)}
               >
                  <Star fillPercentage={getFillPercentage(index)} size={size} />
               </div>
            ))}
            <DeleteRatingButton
               shouldDisplay={shouldDisplay}
               handleRemoveMutation={handleRemoveMutation}
            />
         </div>
         <h3 className='text-center my-2 text-slate-800 dark:text-slate-200'>{ratingTitle}</h3>
      </div>
   );
};
