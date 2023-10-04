import { RatingData } from '../types/serverPropsTypes';

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
   if (!ratingData) return 0;

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
