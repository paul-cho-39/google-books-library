import { BookState, Prisma, UserBook } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { Data } from '../../../lib/types/models/books';
import Books from './Books';

export type UserBookWithoutId = Omit<UserBook, 'userId' | 'bookId'>;

export default class BookCreator extends Books {
   constructor(userId: string, bookId: string) {
      super(userId, bookId);
   }
   async createOrUpdateBookAndState(data: Data, stateData: UserBookWithoutId) {
      this.checkIds();
      await prisma.book.upsert({
         where: this.getBookId,
         create: {
            id: this.bookId,
            title: data.title,
            subtitle: data.subtitle,
            categories: data.categories ?? [],
            authors: data.authors ?? [],
            language: data.language,
            publishedDate: new Date(data.publishedDate),
            pageCount: data.pageCount,
            industryIdentifiers: (data.industryIdentifiers as Prisma.JsonArray) ?? Prisma.JsonNull,
         },
         update: {
            users: {
               update: {
                  where: {
                     userId_bookId: this.getBothIds,
                  },
                  data: {
                     ...stateData,
                  },
               },
               connectOrCreate: {
                  where: {
                     userId_bookId: this.getBothIds,
                  },
                  create: {
                     userId: this.userId,
                     ...stateData,
                  },
               },
            },
         },
      });
   }
   // due to createOrUpdateBookAndState upsert has slower performance creating a
   // should separate the method
   // if the user currently contains books and have IDs then return
   // then UPDATE the book
   async updateBookState(stateData: UserBookWithoutId) {
      await prisma.userBook.update({
         where: {
            userId_bookId: this.getBothIds,
         },
         data: {
            ...stateData,
         },
      });
   }
}
