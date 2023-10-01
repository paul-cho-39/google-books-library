import prisma from '../../../../lib/prisma';
import { Book, BookState } from '@prisma/client';
import Books from '../Books';

export default class BookRetriever extends Books {
   constructor(userId: string, bookId: string) {
      super(userId, bookId);
   }
   async getBooksByState(state: BookState): Promise<Book[]> {
      this.checkIds();

      const userBooks = await prisma.userBook.findMany({
         where: {
            userId: this.userId,
            state: state,
         },
         include: {
            book: true,
         },
      });

      return userBooks.map((ub) => ub.book);
   }

   async getAllBooks() {
      this.checkIds();

      return await prisma.userBook.findFirst({
         where: {
            AND: [this.getBothIds],
         },
         include: {
            book: true,
         },
      });
   }
}

// async getAllBooks() {
//     // for concurrently fetching all books
//     const books = await Promise.all([
//        await this.getIdsForBook<'finished'>(prisma.finished),
//        await this.getIdsForBook<'want'>(prisma.want),
//        await this.getIdsForBook<'reading'>(prisma.reading),
//     ]);
//     return {
//        library: {
//           finished: books[0],
//           wantToRead: books[1],
//           currentlyReading: books[2],
//        },
//     };
//  }
