import { BookIdProps, Items } from '../lib/types/googleBookTypes';

export type APISource = 'google' | 'nyt';

// return boolean instead?
export default function matchIds(book: Items<any>, bookIds: Array<BookIdProps>) {
   const bookId = bookIds.find((bookId) => bookId.id === book.id);
   return typeof bookId === 'string' ? bookId : bookId?.id;
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

// can have the keys as an object as well
export const handleCacheKeys = {
   recent: {
      suffix: 'newest',
      key: (slug: string) => slug + handleCacheKeys.recent.suffix,
   },
   relevance: {
      suffix: 'relevance',
      key: (slug: string) => slug + handleCacheKeys.relevance.suffix,
   },
   fiction: {
      suffix: 'fiction',
      key: (date: string) => date + handleCacheKeys.fiction.suffix,
   },
   nonfiction: {
      suffix: 'nonfiction',
      key: (date: string) => date + handleCacheKeys.nonfiction.suffix,
   },
};

export function getBookIdAndSource(slug: string) {
   let id: string;
   let source: APISource;
   if (slug.includes(handleNytId.suffix)) {
      id = handleNytId.removeSuffix(slug);
      source = 'nyt';
   } else {
      id = slug;
      source = 'google';
   }

   return { id, source };
}
