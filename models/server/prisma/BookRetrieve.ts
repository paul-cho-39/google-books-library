import prisma from '../../../lib/prisma';
import { Book, BookState } from '@prisma/client';
import Books from './Books';

export default class BookRetriever {
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
   async getAllUserBooks(userId: string) {
      return await prisma.userBook.findMany({
         where: { userId: userId },
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
         where: { bookId: { contains: bookId } },
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
}
