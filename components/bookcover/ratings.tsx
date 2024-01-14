import StarRating, { StarRatingProps } from '../icons/starRating';

export interface RatingProps extends StarRatingProps {
   totalReviews?: number;
   displayText?: boolean;
}

/**
 *
 * @param {Object} RatingProps
 * @param {number} props.averageRating total number to display out of 'totalReviews.' If 'totalReviews' undefined it is the number to display out of five.
 * @param {number} props.totalReviews
 * @param {RatingProps['size']} props.size
 * @param {boolean} props.displayText will display 'reviews' text if true.
 *
 */
const DisplayRating = ({
   averageRating = 0,
   totalReviews,
   size = 'small',
   displayText = true,
}: RatingProps) => {
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
            {displayText && <span className='text-xs font-light'>{reviews}</span>}
         </p>
      </div>
   );
};

export default DisplayRating;
