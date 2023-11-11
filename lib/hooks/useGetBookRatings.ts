import { useMemo } from 'react';
import { Items } from '../types/googleBookTypes';
import { MultipleRatingData } from '../types/serverTypes';
import { getAverageRatings, getTotalRatings } from '../helper/getRating';

function useGetBookRatings(data: Items<any>, rateData: MultipleRatingData | null | undefined) {
   const [avgRating, totalRatings] = useMemo(() => {
      const googleTotal = data?.volumeInfo?.ratingsCount || 0;
      const googleAvg = data?.volumeInfo?.averageRating || 0;

      const totalRatings = getTotalRatings(rateData?.count || 0, googleTotal);
      const avgRating = getAverageRatings(
         rateData?.avg || 0,
         rateData?.count || 0,
         googleAvg,
         googleTotal
      );

      return [avgRating, totalRatings];
   }, [rateData, data]);

   return { avgRating, totalRatings };
}

export default useGetBookRatings;
