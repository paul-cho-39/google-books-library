import { Dispatch, useState, SetStateAction, useEffect } from 'react';
import Star, { Size } from '../icons/starIcon';
import DeleteRatingButton, { DeleteRatingButtonProps } from '../buttons/deleteRatingButton';
import { NextRouter, useRouter } from 'next/router';
import ROUTES from '@/utils/routes';
import useHandleRating from '@/lib/hooks/useHandleRating';
import { MutationBase } from '@/lib/types/models/books';
import { MultipleRatingData, SingleRatingData } from '@/lib/types/serverTypes';
import { Items } from '@/lib/types/googleBookTypes';

// export type ActiveRatingProps = {
//    ratingTitle: string;
//    selectedRating: number | null;
//    setSelectedRating: Dispatch<SetStateAction<number | null>>;
//    handleMutation: (rating: number) => void;
//    userId: string | null;
//    router: NextRouter;
//    size?: Size;
// } & DeleteRatingButtonProps;

export type ActiveRatingProps = {
   params: MutationBase;
   data: Items<any>;
   allRatingData: MultipleRatingData | null | undefined;
   size?: Size;
   // router: NextRouter;
} & Omit<DeleteRatingButtonProps, 'handleRemoveMutation'>;

const ActiveRating = ({
   params,
   shouldDisplay,
   data,
   allRatingData,
   size = 'large',
}: ActiveRatingProps) => {
   const userRatingData = params.prevRatingData;
   const [hoveredStar, setHoveredStar] = useState<number | null>(null);
   const [isReady, setIsReady] = useState(false);

   const ratingTitle = !userRatingData ? 'Rate this book' : 'Rating saved';
   const [selectedRating, setSelectedRating] = useState<null | number>(
      userRatingData?.ratingInfo?.ratingValue || 0
   );

   const router = useRouter();
   const { handleMutation, handleRemoveMutation, currentRatingData } = useHandleRating(
      {
         ...params,
         prevRatingData: userRatingData,
      },
      data,
      allRatingData
   );

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
      if (isReady && !params.userId) {
         router.push(ROUTES.AUTH.SIGNIN_NEXT(router.asPath));
      } else {
         const adjustedRating = adjustRating(rating);
         setSelectedRating(adjustedRating);

         handleMutation(rating);
      }
   };

   const getFillPercentage = (index: number) => {
      // first evaluate hovered state
      if (hoveredStar !== null) {
         return adjustRating(index) <= hoveredStar ? 100 : 0;
      } else if (selectedRating !== null) {
         // should not display means rating has been removed
         if (!shouldDisplay) return 0;
         else return adjustRating(index) <= selectedRating ? 100 : 0;
      }
      return 0;
   };

   useEffect(() => {
      if (!router.isReady) return;

      setIsReady(true);
   }, [router]);

   return (
      <div className='flex flex-col items-center'>
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
         <div role='' className='lg:text-lg flex items-center space-x-2'>
            <h3 className='text-center my-2 text-slate-800 dark:text-slate-200'>{ratingTitle}</h3>
            {shouldDisplay && (
               <DeleteRatingButton
                  shouldDisplay={shouldDisplay}
                  handleRemoveMutation={handleRemoveMutation}
               />
            )}
         </div>
      </div>
   );
};

export default ActiveRating;

// export const ActiveRating = ({
//    ratingTitle,
//    shouldDisplay,
//    handleRemoveMutation,
//    selectedRating,
//    setSelectedRating,
//    handleMutation,
//    userId,
//    router,
//    size = 'small',
// }: ActiveRatingProps) => {
//    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
//    const [isReady, setIsReady] = useState(false);

//    const adjustRating = (num: number) => {
//       return num + 1;
//    };

//    const handleMouseEnter = (index: number) => {
//       setHoveredStar(adjustRating(index));
//    };

//    const handleMouseLeave = () => {
//       setHoveredStar(null);
//    };

//    //   may have to change this logic here
//    const handleClick = (rating: number) => {
//       if (isReady && !userId) {
//          router.push(ROUTES.AUTH.SIGNIN_NEXT(router.asPath));
//       } else {
//          const adjustedRating = adjustRating(rating);
//          setSelectedRating(adjustedRating);

//          handleMutation(rating);
//       }
//    };

//    const getFillPercentage = (index: number) => {
//       // first evaluate hovered state
//       if (hoveredStar !== null) {
//          return adjustRating(index) <= hoveredStar ? 100 : 0;
//       } else if (selectedRating !== null) {
//          // should not display means rating has been removed
//          if (!shouldDisplay) return 0;
//          else return adjustRating(index) <= selectedRating ? 100 : 0;
//       }
//       return 0;
//    };

//    useEffect(() => {
//       if (!router.isReady) return;

//       setIsReady(true);
//    }, [router]);

//    return (
//       <div className='flex flex-col items-center'>
//          <div className='flex flex-row cursor-pointer'>
//             {Array.from({ length: 5 }).map((_, index) => (
//                <div
//                   key={index}
//                   onMouseEnter={() => handleMouseEnter(index)}
//                   onMouseLeave={handleMouseLeave}
//                   onClick={() => handleClick(index)}
//                >
//                   <Star fillPercentage={getFillPercentage(index)} size={size} />
//                </div>
//             ))}
//          </div>
//          <div role='' className='lg:text-lg flex items-center space-x-2'>
//             <h3 className='text-center my-2 text-slate-800 dark:text-slate-200'>{ratingTitle}</h3>
//             <DeleteRatingButton
//                shouldDisplay={shouldDisplay}
//                handleRemoveMutation={handleRemoveMutation}
//             />
//          </div>
//       </div>
//    );
// };
