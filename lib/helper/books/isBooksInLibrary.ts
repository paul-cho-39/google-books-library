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
import { ResponseFinishedData } from '@/lib/types/serverTypes';

// helper function
function isBookInLib(id: string, bookData: string[]) {
   return bookData.some((bookId) => bookId === id);
}

export function isBookInData(id: string, bookData?: string[]) {
   return bookData ? isBookInLib(id, bookData) : false;
}

export function ensureLibraryData<TLib extends Library | ResponseFinishedData>(
   library: TLib
): Library | undefined {
   // sometimes react-query fail to return the data but instead return the entire response
   // so this checks this part
   if (library && 'data' in library) {
      return library.data;
   } else if (library) {
      return library;
   } else return;
}

// entire user library books
export function isBookInDataBooks(library: Library | undefined, id: string) {
   if (!library) return;
   for (const state in library) {
      if (library && library[state as RefinedBookState]?.includes(id)) {
         return true;
      }
   }
   return false;
}
