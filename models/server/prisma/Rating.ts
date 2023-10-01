import prisma from '../../../lib/prisma';
import Books from './Books';

export default class BookRatings extends Books {
   constructor(userId: string, bookId: string) {
      super(userId, bookId);
   }

   async createOrUpdateRatings(rating: number | string) {
      this.checkIds();
      const ratingInNum = this.toNumber(rating);

      await prisma.rating.upsert({
         where: {
            userId_bookId: this.getBothIds,
         },
         create: {
            bookId: this.bookId,
            userId: this.userId,
            ratingValue: ratingInNum,
         },
         update: {
            bookId: this.bookId,
            userId: this.userId,
            ratingValue: ratingInNum,
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
