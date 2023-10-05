import { Book, UserBook } from '@prisma/client';
import { RefinedBookState, Library } from '../../../lib/types/models/books';

type AllUserBooks = (UserBook & {
   book: Book;
})[];

// keep it decouped in general to maintain cleaner code
export class RefineData {
   constructor() {}

   refineBooks(userBooks: AllUserBooks) {
      const library: Library = {
         finished: [],
         reading: [],
         want: [],
         unfinished: [],
      };

      userBooks.forEach((ub) => {
         const key = ub.state.toLocaleLowerCase() as RefinedBookState;
         library[key].push(ub.book.id);
      });

      library['unfinished'] = [...library.reading, ...library.want];

      return library;
   }
   // TODO: change title (inaccurate title)
   refineDates<T>(data: T) {
      if (data instanceof Date) {
         return data.toISOString() as unknown as T;
      }

      if (typeof data === 'object' && data !== null) {
         for (let key in data) {
            if (data.hasOwnProperty(key)) {
               (data as T)[key] = this.refineDates((data as T)[key]);
            }
         }
      }

      return data;
   }
}

const refiner = new RefineData();
export default refiner;
