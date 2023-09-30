import { BookState, Prisma, UserBook } from '@prisma/client';
import prisma from '../../../../../lib/prisma';
import { Data } from '../../../../../lib/types/models/books';

type UserBookWithoutId = Omit<UserBook, 'userId' | 'bookId'>;

export default class BookCreator {
   data: Data;
   // industryIdentifiers: string[];
   // authors: string[];
   // categories: string[];
   constructor(
      data: Data
      // categories: string[],
      // authors: string[],
      // industryIdentifiers: string[],
   ) {
      this.data = data;
      // this.categories = categories;
      // this.authors = authors;
      // this.industryIdentifiers = industryIdentifiers;
   }

   async createNewBook(stateData: UserBookWithoutId) {
      this.checkIds(this.data.id, this.data.userId);

      await prisma.book.upsert({
         where: { id: this.data.id },
         create: {
            id: this.data.id,
            title: this.data.title,
            subtitle: this.data.subtitle,
            categories: this.data.categories ?? [],
            authors: this.data.authors ?? [],
            language: this.data.language,
            publishedDate: new Date(this.data.publishedDate),
            pageCount: this.data.pageCount,
            industryIdentifiers:
               (this.data.industryIdentifiers as Prisma.JsonArray) ?? Prisma.JsonNull,
         },
         update: {
            users: {
               connectOrCreate: {
                  where: {
                     userId_bookId: {
                        bookId: this.data.id,
                        userId: this.data.userId,
                     },
                  },
                  create: {
                     userId: this.data.userId,
                     ...stateData,
                  },
               },
            },
         },
      });
   }

   private checkIds(userId: string, bookId: string) {
      if (!bookId || !userId) throw Error(`Required parameter id has not been provided`);
   }
}
