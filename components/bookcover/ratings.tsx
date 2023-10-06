import { Dispatch, SetStateAction, useState } from 'react';
import Star, { Size } from '../icons/starIcon';
import StarRating, { StarRatingProps } from '../icons/starRating';

export interface RatingProps extends StarRatingProps {
   totalReviews?: number;
}

const DisplayRating = ({ averageRating = 0, totalReviews, size = 'small' }: RatingProps) => {
   const reviews = totalReviews && totalReviews > 0 ? totalReviews + ' ' + 'ratings' : ' No rating';

   return (
      <div className='flex flex-row items-center justify-start overflow-hidden'>
         <StarRating size={size} averageRating={averageRating} />
         <p className='dark:text-slate-400 text-slate-600 text-xs font-light'>
            {totalReviews && (
               <>
                  <span className=''>{averageRating} avg rating</span>
                  <span className=''> / </span>
               </>
            )}
            <span className='text-xs font-light'>{reviews}</span>
         </p>
      </div>
   );
};

interface ActiveRatingProps {
   ratingTitle: string;
   onRatingSelected?: (rating: number) => void;
   size?: Size;
   selectedRating: number | null;
   setSelectedRating: Dispatch<SetStateAction<number | null>>;
}

export const ActiveRating = ({
   ratingTitle,
   onRatingSelected,
   selectedRating,
   setSelectedRating,
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
      if (onRatingSelected) {
         onRatingSelected(adjustedRating);
      }
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
         </div>
         <h3 className='text-center my-2 text-slate-800 dark:text-slate-200'>{ratingTitle}</h3>
      </div>
   );
};

export default DisplayRating;
