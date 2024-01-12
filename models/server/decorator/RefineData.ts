import prisma from '@/lib/prisma';
import { Book, UserBook } from '@prisma/client';
import { RefinedBookState, Library } from '@/lib/types/models/books';

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
    * @param bookId
    * @param page
    * @param limit
    * @returns {Comments}
    */
   async getCommentsByBookId(bookId: string, page: number, limit: number = 10) {
      const skip = (page - 1) * limit;
      const comments = await prisma.comment.findMany({
         where: {
            bookId: bookId,
         },
         take: limit,
         skip: skip,
         orderBy: {
            dateAdded: 'desc',
         },
         include: {
            // NOTE: there is no take or limit here as the project is unlikely to exceed this
            replies: {
               include: {
                  replies: true,
                  user: {
                     select: {
                        name: true,
                        username: true,
                     },
                  },
               },
            },
            upvote: true,
            _count: true,
            user: {
               select: {
                  name: true,
                  username: true,
               },
            },
         },
      });
      // since wrapping inside Promise.all, running 'async' inside map is ok
      const refinedComments = await Promise.all(
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

      return refinedComments;
   }
}

//
const refiner = new RefineData();
export default refiner;
