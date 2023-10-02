import Star, { Size, StarProps } from '../icons/starIcon';

export interface StarRatingProps {
   averageRating?: number;
   size?: Size;
}

const StarRating = ({ averageRating = 0, size }: StarRatingProps) => {
   const filledStars = Math.floor(averageRating);
   const remainder = averageRating - filledStars;
   return (
      <div className='flex flex-row'>
         {Array.from({ length: 5 }).map((_, index) => {
            if (averageRating) {
               if (index < filledStars) {
                  return <Star fillPercentage={100} size={size} key={index} />;
               } else if (index === filledStars) {
                  return <Star fillPercentage={remainder * 100} size={size} key={index} />;
               }
            }
            return <Star fillPercentage={0} key={index} />;
         })}
      </div>
   );
};

export default StarRating;
