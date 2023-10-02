import { Book, UserBook } from '@prisma/client';
import { RefinedBookState, Library } from '../../../lib/types/models/books';

type AllUserBooks = (UserBook & {
   book: Book;
})[];

// keep it decouped in general to maintain cleaner code
export default class RefineData {
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
}
