import { Dispatch, useState, SetStateAction } from 'react';
import Star, { Size } from '../icons/starIcon';
import { BaseIdParams } from '../../lib/types/models/books';
import { GoogleUpdatedFields, Items } from '../../lib/types/googleBookTypes';
import { MultipleRatingData, SingleRatingData } from '../../lib/types/serverTypes';
import useMutateRatings from '../../lib/hooks/useMutateRating';
import { getBodyFromFilteredGoogleFields } from '../../lib/helper/books/getBookBody';

export type ActiveRatingProps = BaseIdParams & {
   ratingTitle: string;
   //    onRatingSelected?: (rating: number) => void;
   size?: Size;
   selectedRating: number | null;
   setSelectedRating: Dispatch<SetStateAction<number | null>>;
   data: Items<any>;
   currentRatingData: MultipleRatingData | null | undefined;
   initialData?: SingleRatingData;
};

export const ActiveRating = ({
   ratingTitle,
   //    onRatingSelected,
   selectedRating,
   setSelectedRating,
   size = 'small',
   userId,
   bookId,
   data,
   currentRatingData,
   initialData,
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

   const {
      mutation: { mutate: mutateCreate },
   } = useMutateRatings<'create'>(
      { bookId: bookId, userId: userId, initialData: initialData },
      'create'
   );

   const {
      mutation: { mutate: mutateUpdate },
   } = useMutateRatings<'update'>(
      { bookId: bookId, userId: userId, initialData: initialData },
      'update'
   );

   const handleMutation = (rating: number) => {
      const notCreated = currentRatingData && !currentRatingData.inLibrary;
      const bookData = getBodyFromFilteredGoogleFields(data);
      const createBody = { bookData, rating };
      const updateBody = { rating };
      notCreated ? mutateCreate(createBody) : mutateUpdate(updateBody);
   };

   //   may have to change this logic here
   const handleClick = (rating: number) => {
      const adjustedRating = adjustRating(rating);
      setSelectedRating(adjustedRating);
      handleMutation(rating);
      //   if (onRatingSelected) {
      //  onRatingSelected(adjustedRating);
      //   }
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
