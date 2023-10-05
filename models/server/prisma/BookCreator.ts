import { Book, BookState, Prisma, UserBook } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { Data } from '../../../lib/types/models/books';
import Books from './Books';

export type UserBookWithoutId = Omit<UserBook, 'userId' | 'bookId'>;
export type BookWithoutDeletion = Omit<Book, 'isDeleted' | 'dateDeleted'>;

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
            users: {
               connectOrCreate: {
                  where: { userId_bookId: this.getBothIds },
                  create: {
                     userId: this.userId,
                     ...stateData,
                  },
               },
            },
         },
         update: {
            users: {
               upsert: {
                  where: { userId_bookId: this.getBothIds },
                  update: {
                     ...stateData,
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
   async createBook(data: Data) {
      await prisma.book.create({
         data: {
            id: this.bookId,
            title: data.title,
            subtitle: data.subtitle,
            publishedDate: new Date(data.publishedDate),
            categories: data.categories ?? [],
            language: data.language,
            pageCount: data.pageCount,
            industryIdentifiers: (data.industryIdentifiers as Prisma.JsonArray) ?? Prisma.JsonNull,
            authors: data.authors ?? [],
         },
      });
   }
   async upsertBookAndRating(data: Data, rating: number | string) {
      this.checkIds();
      const ratingNum = this.toNumber(rating);
      await prisma.book.upsert({
         where: { id: this.bookId },
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
            ratings: {
               upsert: {
                  where: { userId_bookId: this.getBothIds },
                  create: {
                     userId: this.userId,
                     ratingValue: ratingNum,
                  },
                  update: {
                     ratingValue: ratingNum,
                  },
               },
            },
         },
      });
   }

   async updateRatings(rating: number | string) {
      this.checkIds();
      const ratingNum = this.toNumber(rating);

      await prisma.rating.upsert({
         where: {
            userId_bookId: this.getBothIds,
         },
         create: {
            bookId: this.bookId,
            userId: this.userId,
            ratingValue: ratingNum,
         },
         update: { ratingValue: ratingNum },
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
            bookId: this.bookId,
            userId: this.userId,
            ...stateData,
         },
      });
   }
   private toNumber(rating?: number | string) {
      rating = Number(rating);

      if (!rating || isNaN(rating)) {
         throw new Error('Required rating type is missing or have the wrong type');
      }
      return rating;
   }
}
