// **
// unnecessary since react-query is already designed to solve
//*
// export function isBooksInLibrary(
//    id: string,
//    bookData: string[] | undefined,
//    bookIdsCache: string[] | undefined
// ) {
//    let data: boolean | undefined;
//    let cache: boolean | undefined;
//    if (typeof bookData === 'undefined') {
//       data = true;
//    }
//    if (typeof bookIdsCache === 'undefined') {
//       cache = true;
//    }
//    return bookData && bookIdsCache
//       ? isBookInLib(id, bookData) || isBookInLib(id, bookData)
//       : data && bookIdsCache // bookData is undefined and cache contains the id
//       ? isBookInLib(id, bookIdsCache) || data
//       : cache && bookData
//       ? cache || isBookInLib(id, bookData)
//       : (cache as boolean) || (data as boolean);
// }

import { Library, RefinedBookState } from '@/lib/types/models/books';

// helper function
function isBookInLib(id: string, bookData: string[]) {
   return bookData.some((bookId) => bookId === id);
}

export function isBookInData(id: string, bookData?: string[]) {
   return bookData ? isBookInLib(id, bookData) : false;
}

// entire user library books
export function isBookInDataBooks(library: Library | undefined, id: string) {
   if (!library) return false;

   for (const state in library) {
      const lib = library[state as RefinedBookState];
      if (lib && lib?.length > 0 && lib.includes(id)) {
         return true;
      }
   }
   return false;
}
