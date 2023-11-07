import { Library, RefinedBookState } from '@/lib/types/models/books';

export function filterId(book: string[] | undefined, id: string) {
   return book?.filter((bookId) => bookId !== id);
}

export function filterAll(library: Library | undefined, id: string): Library | undefined {
   if (!library) return;

   return Object.entries(library).reduce((acc, [key, bookIds]) => {
      const filtered = filterId(bookIds, id);
      acc[key as RefinedBookState] = filtered || [];
      return acc;
   }, {} as Library);
}
