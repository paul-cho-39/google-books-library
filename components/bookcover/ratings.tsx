import { Dispatch, SetStateAction, useState } from 'react';
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
   selectedRating: number;
   setSelectedRating: Dispatch<SetStateAction<number>>;
}

export const ActiveRating = ({
   onRatingSelected,
   selectedRating,
   setSelectedRating,
   size = 'small',
}: ActiveRatingProps) => {
   const [hoveredStar, setHoveredStar] = useState<number | null>(null);
   //    const [selectedRating, setSelectedRating] = useState<number>(0);

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
         onRatingSelected(rating + 1);
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

   console.log('the current star rating is: ', selectedRating);

   return (
      <div className='flex flex-col'>
         <div className='flex flex-row'>
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
         <h3 className='text-center my-2 text-slate-800 dark:text-slate-200'>Rate this book</h3>
      </div>
   );
};

export default DisplayRating;
