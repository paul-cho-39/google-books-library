import Star from '../icons/starIcon';
import StarRating, { StarRatingProps } from '../icons/starRating';

export interface RatingProps extends StarRatingProps {
   totalReviews?: number;
}

const DisplayRating = ({ averageRating = 0, totalReviews }: RatingProps) => {
   const reviews = totalReviews && totalReviews > 0 ? totalReviews + ' ' + 'ratings' : 'No rating';

   return (
      <div className='flex flex-row items-center justify-start overflow-hidden'>
         <StarRating size='small' averageRating={averageRating} />
         <p className='dark:text-slate-400 text-slate-600 text-xs font-light'>
            {totalReviews && <span className=''>{averageRating} avg rating</span>}
            <span className=''> / </span>
            <span className='text-xs font-light'>{reviews}</span>
         </p>
      </div>
   );
};

export default DisplayRating;
