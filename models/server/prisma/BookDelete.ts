import prisma from '@/lib/prisma';
import Books from './Books';

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
