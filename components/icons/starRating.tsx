import Star, { Size, StarProps } from '../icons/starIcon';

export interface StarRatingProps {
   averageRating?: number;
   size?: Size;
}

const StarRating = ({ averageRating = 0, size = 'small' }: StarRatingProps) => {
   const filledStars = Math.floor(averageRating);
   const remainder = (averageRating - filledStars) * 100;

   const fillPercentages = [
      ...Array(filledStars).fill(100),
      remainder,
      ...Array(5 - filledStars - 1).fill(0),
   ];
   return (
      <div
         role='group'
         aria-label={`Rating: ${averageRating.toFixed(1)} out of 5 stars`}
         className='flex flex-row'
      >
         {fillPercentages.map((fill, index) => (
            <Star fillPercentage={fill} size={size} key={index} />
         ))}
      </div>
   );
};

export default StarRating;
