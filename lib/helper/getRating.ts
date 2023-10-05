import { RatingData } from '../types/serverTypes';

export const getAverageRatings = (
   serverAverage: number = 0,
   serverTotal: number = 0,
   localAverage: number = 0,
   localTotal: number = 0
) => {
   const combinedTotal = localTotal + serverTotal;
   if (combinedTotal === 0) return 0;

   const combinedAverage = localTotal * localAverage + serverTotal * serverAverage;

   //    return Math.round(combinedAverage * 10) / 10;
   return toNearestTenth(combinedAverage);
};

export const getTotalRatings = (serverTotal: number = 0, localTotal: number = 0) => {
   return serverTotal + localTotal;
};

export const getServerAverage = (ratingData: RatingData[] | null | undefined) => {
   if (!ratingData || ratingData.length <= 0) {
      return 0;
   }

   console.log('rating data is: ', ratingData);

   const totalSum = ratingData
      .map((data) => data.ratingValue)
      .reduce((prev, acc) => {
         return prev + acc;
      }, 0);

   const avg = totalSum / ratingData.length;
   return toNearestTenth(avg);
};

const toNearestTenth = (num: number) => {
   return Math.round(num * 10) / 10;
};

const checkData = <T>(data: T | null | undefined) => {
   if (Array.isArray(data) && data) {
      const check = data.length <= 0;
      return check ? 0 : data;
   }
   // if null or undefined return 0
   return 0;
};
