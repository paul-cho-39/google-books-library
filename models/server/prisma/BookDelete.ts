import prisma from '@/lib/prisma';
import Books from './Books';
import { Prisma } from '@prisma/client';

export default class BookDelete extends Books {
   constructor(userId: string, bookId: string) {
      super(userId, bookId);
   }

   async deleteBook() {
      await prisma.book.delete({
         where: this.getBookId,
      });
   }
   async deleteRating() {
      await prisma.rating.delete({
         where: {
            userId_bookId: this.getBothIds,
         },
      });
   }
   async deleteRatingAndBook() {
      return await prisma.$transaction(async (tx) => {
         // delete rating first
         await tx.rating.deleteMany({
            where: {
               bookId: this.bookId,
               userId: this.userId,
            },
         });

         // checking to see if the book is associated with any users
         const bookAssociations = await tx.book.findUnique({
            where: { id: this.bookId },
            include: {
               users: true,
               ratings: true,
            },
         });

         // if the book has no other associations then delete
         if (bookAssociations && bookAssociations.users.length === 0) {
            await tx.book.delete({
               where: { id: this.bookId },
            });
         }

         // Return some indicator of the transaction result if needed
         return bookAssociations;
      });
   }
   // async deleteLogs(id: number) {
   //    id = this.toNumber(id);
   //    await prisma.log.delete({
   //       where: { id: id },
   //    });
   // }

   // async deleteAllLogs() {
   //    await prisma.log.delete({
   //       where: {
   //          userId_bookId: {
   //             bookId: this.id,
   //             userId: this.userId,
   //          },
   //       },
   //    });
   // }
}
