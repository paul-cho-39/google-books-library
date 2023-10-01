import prisma from '../../../lib/prisma';

export default class BookDelete {
   userId: string;
   id: string;
   constructor(userId: string, id: string) {
      this.userId = userId;
      this.id = id;
   }

   async deleteBook() {
      await prisma.book.delete({
         where: {
            id: this.id,
         },
      });
   }
   async deleteRating() {
      await prisma.rating.delete({
         where: {
            userId_bookId: {
               bookId: this.id,
               userId: this.userId,
            },
         },
      });
   }
   async deleteLogs(id: number) {
      id = this.toNumber(id);
      await prisma.log.delete({
         where: { id: id },
      });
   }

   async deleteAllLogs() {
      await prisma.log.delete({
         where: {
            userId_bookId: {
               bookId: this.id,
               userId: this.userId,
            },
         },
      });
   }
   private toNumber(logId?: number | string) {
      logId = Number(logId);

      if (!logId || isNaN(logId)) {
         throw new Error('Required logId is missing or have the wrong type');
      }
      return logId;
   }
}
