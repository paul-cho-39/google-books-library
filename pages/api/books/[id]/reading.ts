import type { NextApiRequest, NextApiResponse } from 'next';
import BookCreator, { UserBookWithoutId } from '../../../../models/server/prisma/BookCreator';
import BookStateHandler from '../../../../models/server/prisma/BookState';
import { errorLogger, internalServerErrorLogger } from '../../../../models/server/winston';
import { Prisma } from '@prisma/client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { userId, id, ...data } = req.body;

      const creator = new BookCreator(userId, id);
      const stateData = BookStateHandler.getBookState('Reading', {
         isPrimary: true,
      });

      try {
         await creator.createOrUpdateBookAndState(data, stateData as UserBookWithoutId);
         return res.status(201).json({ success: true });
      } catch (err) {
         errorLogger(err, req);
         return res.end(err);
      }
   }
   if (req.method === 'PUT') {
      // make sure that it doesnt add duplicates
      const { id, userId } = req.body;
      const creator = new BookCreator(userId, id);
      const stateData = BookStateHandler.getBookState('Reading', {
         isPrimary: false,
      });
      try {
         await creator.updateBookState(stateData as UserBookWithoutId);
         return res.status(201).json({ success: true });
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Book does not exist for this user.');
         }
         errorLogger(error, req);
      }
   } else {
      internalServerErrorLogger(req);
      return res.status(500).end({ message: 'Internal Server Error' });
   }
}
