import type { NextApiRequest, NextApiResponse } from 'next';
import BookRatings from '../../../../../models/server/prisma/Rating';
import { errorLogger, internalServerErrorLogger } from '../../../../../models/server/winston';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { id: userId, slug: bookId } = req.query;
      const { rating } = req.body;

      const rater = new BookRatings(userId as string, bookId as string);
      try {
         rater.updateRatings(rating as number);
         res.status(201).json({ success: true });
      } catch (err) {
         errorLogger(err, req);
         res.end(err);
      }
   } else {
      internalServerErrorLogger(req);
      return res.status(500).json({ message: 'Internal server error' });
   }
}
