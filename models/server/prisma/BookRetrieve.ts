import prisma from '@/lib/prisma';
import { Book, BookState } from '@prisma/client';

export class BookRetriever {
   constructor() {}
   async getBooksByState(userId: string, state: BookState) {
      const userBooks = await prisma.userBook.findMany({
         where: {
            userId: userId,
            state: state,
         },
         include: {
            book: true,
         },
      });

      return userBooks.map((ub) => ub.book);
   }
   // retrieves books if it has not been soft deleted
   async getAllValidUserBooks(userId: string) {
      return await prisma.userBook.findMany({
         where: {
            AND: [
               { userId: userId },
               {
                  book: {
                     isNot: { isDeleted: true },
                  },
               },
            ],
         },
         include: {
            book: true,
         },
      });
   }
   async getAllRatingsFromUser(userId: string) {
      return await prisma.rating.findMany({
         where: { userId: { equals: userId } },
      });
   }
   async getRatingByBook(bookId: string) {
      return await prisma.rating.findMany({
         where: { bookId: { equals: bookId } },
         select: {
            bookId: true,
            userId: true,
            ratingValue: true,
            dateAdded: true,
            dateUpdated: true,
         },
      });
   }
   async getBatchRatingsByBooks(bookIds: string[]) {
      return await prisma.rating.findMany({
         where: {
            bookId: { in: bookIds },
         },
      });
   }
   // for users info at their /dashboard
   async getBatchRatingsWithCountAndAvg(bookIds: string[]) {
      return await prisma.rating.groupBy({
         by: ['bookId'],
         where: {
            bookId: {
               in: bookIds,
            },
         },
         _count: true,
         _avg: {
            ratingValue: true,
         },
      });
   }
   async isBookInLibrary(bookId: string) {
      return await prisma.book.findUnique({
         where: { id: bookId },
      });
   }
}

const retriever = new BookRetriever();
export default retriever;
