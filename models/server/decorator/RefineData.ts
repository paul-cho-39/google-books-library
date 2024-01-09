import prisma from '@/lib/prisma';
import { Book, UserBook } from '@prisma/client';
import { RefinedBookState, Library } from '@/lib/types/models/books';
import { Comments } from '../prisma/BookRetrieve';

type AllUserBooks = (UserBook & {
   book: Book;
})[];

// keep it decouped in general to maintain cleaner code
// refines data and acts more like a decorator;
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
         library[key]?.push(ub.book.id);
      });

      library['unfinished'] = [...(library.reading || []), ...(library.want || [])];

      return library;
   }

   refineDates<T>(data: T) {
      if (data instanceof Date) {
         return data.toISOString() as unknown as T;
      }

      // add an array type if needed
      // and can separate the logic into different functions depending on the data type?
      if (typeof data === 'object' && data !== null) {
         for (let key in data) {
            if (data.hasOwnProperty(key)) {
               (data as T)[key] = this.refineDates((data as T)[key]);
            }
         }
      }

      return data;
   }
   /**
    * @description Refines the currnet Comment data and adds 'upvoteCount' for each comment.
    * @param comments
    * @returns
    */
   async countUpvotes(comments: Comments) {
      // since wrapping inside Promise.all, running 'async' inside map is ok
      return await Promise.all(
         comments.map(async (comment) => {
            const upvoteCount = await prisma.upvotes.count({
               where: { upvoteId: comment.id },
            });

            return {
               ...comment,
               upvoteCount: upvoteCount,
            };
         })
      );
   }
}

//
const refiner = new RefineData();
export default refiner;
