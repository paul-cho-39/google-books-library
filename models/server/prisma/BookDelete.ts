import prisma from '@/lib/prisma';
import Books from './Books';
import { Prisma } from '@prisma/client';

export default class BookDelete extends Books {
   constructor(userId: string, bookId: string) {
      super(userId, bookId);
   }

   async deleteRating() {
      await prisma.$transaction(async (tx) => {
         tx.session.findFirstOrThrow({
            where: { userId: this.userId },
         });

         // since unique id is both bookId and userId no need to verify userId === userId
         await tx.rating.delete({
            where: {
               userId_bookId: this.getBothIds,
            },
         });
      });
   }

   async deleteComment(commentId: number) {
      const comment = await prisma.comment.findUnique({
         where: { id: commentId },
      });

      if (!comment) {
         throw new Error('Error finding the comment');
      }

      if (comment?.userId !== this.userId) {
         throw new Error('The user is not authorized to delete this comment');
      }

      await prisma.comment.delete({
         where: { id: commentId },
      });
   }
   // when retrieving the book
   // 1) make sure it does not retrieve that contains 'isDeleted' flag
   // 2)
   // when just deleting the book it will have to
   // 1) check if the rating is associated with the book
   // 2) if rating is not associated then delete
   // 3) if it is then soft delete and mark 'isDeleted' and 'dateDeleted'

   // when soft deleting the book and after adding the book to retrieve the book, if the book is
   // added,
   // 1) see if the book is on the list
   // 2) see if the book is deleted
   // 3) if it is deleted then delete the book again

   // when rating the book too batch update
   // 1) first find if the book is on the list
   // 2) if it is then update the book and also update
   async deleteBook() {
      return await prisma.$transaction(async (tx) => {
         // find user first
         tx.session.findFirstOrThrow({
            where: { userId: this.userId },
         });
         // find if there is rating data
         try {
            const associatedRatings = await tx.rating.count({
               where: { bookId: this.bookId },
            });

            const associatedComments = await tx.comment.count({
               where: { bookId: this.bookId },
            });

            //  if there is no association with rating or comments then delete the book
            if (associatedRatings <= 0 || associatedComments <= 0) {
               await tx.book.delete({
                  where: this.getBookId,
               });
            } else {
               await tx.book.update({
                  where: this.getBookId,
                  data: {
                     isDeleted: true,
                     dateDeleted: new Date(),
                     users: {
                        delete: { userId_bookId: this.getBothIds },
                     },
                  },
               });
            }
         } catch (err) {
            console.error('Failed to complete the transaction to delete the book', err);
         }
      });
   }
}
