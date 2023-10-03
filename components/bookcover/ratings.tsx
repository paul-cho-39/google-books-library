import { useState } from 'react';
import Star, { Size } from '../icons/starIcon';
import StarRating, { StarRatingProps } from '../icons/starRating';

export interface RatingProps extends StarRatingProps {
   totalReviews?: number;
}

const DisplayRating = ({ averageRating = 0, totalReviews, size = 'small' }: RatingProps) => {
   const reviews = totalReviews && totalReviews > 0 ? totalReviews + ' ' + 'ratings' : 'No rating';

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
   onRatingSelected?: (rating: number) => void;
   size?: Size;
}

export const ActiveRating = ({ onRatingSelected, size }: ActiveRatingProps) => {
   const [hoveredStar, setHoveredStar] = useState<number | null>(null);
   const [selectedRating, setSelectedRating] = useState<number | null>(null);

   const handleMouseEnter = (index: number) => {
      setHoveredStar(index);
   };

   const handleMouseLeave = () => {
      setHoveredStar(null);
   };

   //   may have to change this logic here
   const handleClick = (rating: number) => {
      setSelectedRating(rating);
      if (onRatingSelected) {
         onRatingSelected(rating);
      }
   };

   const getFillPercentage = (index: number) => {
      if (hoveredStar !== null) {
         return index <= hoveredStar ? 100 : 0;
      } else if (selectedRating !== null) {
         return index <= selectedRating ? 100 : 0;
      }
      return 0;
   };

   return (
      <div className='flex flex-row'>
         {Array.from({ length: 5 }).map((_, index) => (
            <div
               key={index}
               onMouseEnter={() => handleMouseEnter(index)}
               onMouseLeave={handleMouseLeave}
               onClick={() => handleClick(index + 1)}
            >
               <Star fillPercentage={getFillPercentage(index)} size={size} />
            </div>
         ))}
      </div>
   );
};

export default DisplayRating;
