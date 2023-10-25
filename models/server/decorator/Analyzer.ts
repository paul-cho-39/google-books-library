import { RatingData } from '@/lib/types/serverTypes';

export class DataAnalyzer {
   constructor() {}
   getAverage<T extends RatingData[] | unknown>(data: T) {
      const total = this.getTotal(data) || 0;
      const sums = this.sumAllRatings(data);

      if (total === 0) return 0;

      return this.toNearestTenth(sums / total);
   }
   // gets the average of rating inside an array of objects and nested objects
   sumAllRatings<T extends RatingData[] | unknown>(data: T) {
      // if it is not an array no need for average
      if (!Array.isArray(data)) return 0;

      let total = 0;

      data.forEach((_data) => {
         if (typeof _data === 'object' && _data !== null) {
            if ('ratingValue' in _data && typeof _data.ratingValue === 'number') {
               total += _data.ratingValue;
            }
            // if it is nested object then recursively handle the total
            for (let key in _data) {
               if (_data[key] && Array.isArray(_data[key])) {
                  total += this.sumAllRatings(_data[key]);
               }
            }
         }
      });

      return total;
   }
   // gets the total rating inside an array of objects and nested objects
   getTotal<T extends RatingData[] | unknown>(data: T) {
      if (!Array.isArray(data)) return 0;

      let count = 0;

      data.forEach((item) => {
         count++;
         for (let key in item) {
            // same idea as sumAllRatings
            if (Array.isArray(item[key])) {
               count += this.getTotal(item[key]);
            }
         }
      });

      return count;
   }
   private toNearestTenth = (num: number) => {
      return Math.round(num * 10) / 10;
   };
}

const analyzer = new DataAnalyzer();
export default analyzer;
