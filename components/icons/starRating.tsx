import Star, { Size, StarProps } from '../icons/starIcon';

export interface StarRatingProps {
   averageRating?: number;
   size?: Size;
}

const StarRating = ({ averageRating = 0, size = 'small' }: StarRatingProps) => {
   const adjustRating = 1 + averageRating;
   const filledStars = Math.floor(adjustRating);
   const remainder = adjustRating - filledStars;
   return (
      <div className='flex flex-row'>
         {Array.from({ length: 5 }).map((_, index) => {
            if (averageRating) {
               if (index + 1 < filledStars) {
                  return <Star fillPercentage={100} size={size} key={index} />;
               } else if (index === filledStars) {
                  return <Star fillPercentage={remainder * 100} size={size} key={index} />;
               }
            }
            return <Star size={size} fillPercentage={0} key={index} />;
         })}
      </div>
   );
};

export default StarRating;
