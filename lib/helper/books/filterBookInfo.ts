import { Items, Pages, VolumeInfo } from '../../types/googleBookTypes';

// CONSIDER: if there are more functions to run
// consider converting this into a class

const filterKeys = [
   'authors',
   'categories',
   'description',
   'imageLinks',
   'industryIdentifiers',
   'infoLink',
   'averageRating',
   'ratingsCount',
   'language',
   'pageCount',
   'publishedDate',
   'publisher',
   'subtitle',
   'title',
] as const;

export type FilterKeysType = (typeof filterKeys)[number];
export type FilteredVolumeInfo = Pick<VolumeInfo, FilterKeysType>;

function filterBookInfo<T extends Items<any>>(data: T) {
   if (!data) {
      console.warn('Cannot convert undefined or null to object');
   }

   const volumeInfo = data.volumeInfo || {};
   const filtered: Partial<FilteredVolumeInfo> = {};

   filterKeys.forEach((key) => {
      if (key in volumeInfo) {
         filtered[key] = volumeInfo[key] as any;
      }
   });

   return filtered;
}

export default filterBookInfo;
