import { Prisma } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import BookCreator, { UserBookWithoutId } from '../../../../models/server/prisma/BookCreator';
import BookStateHandler from '../../../../models/server/prisma/BookState';

// updates the book here
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      // make sure that it doesnt add duplicates
      const { id, userId } = req.body;
      const creator = new BookCreator(id, userId);
      const stateData = BookStateHandler.getBookState('Reading', {
         isPrimary: false,
      });
      try {
         await creator.updateBookState(stateData as UserBookWithoutId);
         return res.status(201).json({ success: true });
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Book does not exist for this user.');
         } else {
            throw error;
         }
      }
   }
}
