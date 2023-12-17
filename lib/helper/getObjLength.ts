import { TestingCategoriesQueries } from '../types/serverTypes';

function getTotalItemsLength(obj: Record<string, unknown[]>) {
   let totalCount = 0;
   for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
         totalCount += obj[key].length;
      }
   }
   return totalCount;
}

export function getBooksDataLength(data: TestingCategoriesQueries[]) {
   let totalCount = 0;
   for (let d of data) {
      totalCount += d?.data?.length || 0;
   }

   return totalCount;
}

export default getTotalItemsLength;
