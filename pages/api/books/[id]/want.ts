import type { NextApiRequest, NextApiResponse } from 'next';
import BookCreator, { UserBookWithoutId } from '../../../../models/server/prisma/BookCreator';
import BookStateHandler from '../../../../models/server/prisma/BookState';
import { errorLogger, internalServerErrorLogger } from '../../../../models/server/winston';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { userId, id, ...data } = req.body;

      const creator = new BookCreator(userId, id);
      const stateData = BookStateHandler.createWant();

      try {
         await creator.createOrUpdateBookAndState(data, stateData as UserBookWithoutId);
         return res.status(201).json({ success: true });
      } catch (err) {
         errorLogger(err, req);
         return res.end(err);
      }
   } else {
      internalServerErrorLogger(req);
      return res.status(500).end({ message: 'Internal Server Error' });
   }
}
