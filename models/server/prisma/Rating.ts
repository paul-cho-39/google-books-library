import prisma from '../../../lib/prisma';
import Books from './Books';

export default class BookRatings extends Books {
   constructor(userId: string, bookId: string) {
      super(userId, bookId);
   }

   async createOrUpdateRatings(rating: number | string) {
      this.checkIds();
      const ratingNum = this.toNumber(rating);

      console.log('DEBUGGING*****');
      console.log('--------------------');
      console.log('--------------------');
      console.log('--------------------');
      console.log('THE RATING IS: ', this.bookId);
      console.log('THE USERID IS: ', this.userId);

      await prisma.rating.upsert({
         where: {
            userId_bookId: this.getBothIds,
         },
         create: {
            bookId: this.bookId,
            userId: this.userId,
            ratingValue: ratingNum,
         },
         update: {
            bookId: this.bookId,
            userId: this.userId,
            ratingValue: ratingNum,
         },
      });
   }
   // whenever getting a single book
   async getRatingByBook() {
      return await prisma.rating.findFirst({
         where: { bookId: this.bookId },
         cursor: {},
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
