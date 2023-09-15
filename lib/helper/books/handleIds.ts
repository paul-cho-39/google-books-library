import { BookIdProps, Items } from '../../types/googleBookTypes';

// return boolean instead?
export default function matchIds(book: Items<any>, bookIds: Array<BookIdProps>) {
   const bookId = bookIds.find((bookId) => bookId.id === book.id);
   return typeof bookId === 'string' ? bookId : bookId?.id;
}

type FilterObject<T> = T extends BookIdProps ? BookIdProps : string;

export function isMatchingIds<FilterObject>(bookIds: Array<FilterObject>, id: string) {
   if (bookIds.keys()) {
      return bookIds.some((bookId) => bookId.id === id);
   } else return bookIds.some((bookId) => bookId === id);
}

export const handleNytId = {
   suffix: '-nytbook',
   appendSuffix: (str: string) => {
      return str + handleNytId.suffix;
   },
   removeSuffix: (str: string) => {
      return str.replace(handleNytId.suffix, '');
   },
};

type Book = { id: string };
