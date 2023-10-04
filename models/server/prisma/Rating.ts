import { Prisma } from '@prisma/client';
import prisma from '../../../lib/prisma';
import { Data } from '../../../lib/types/models/books';
import Books from './Books';

export default class BookRatings extends Books {
   constructor(userId: string, bookId: string) {
      super(userId, bookId);
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
   private toNumber(rating?: number | string) {
      rating = Number(rating);

      if (!rating || isNaN(rating)) {
         throw new Error('Required rating type is missing or have the wrong type');
      }
      return rating;
   }
}
