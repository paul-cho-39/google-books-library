import type { NextApiRequest, NextApiResponse } from 'next';
import BookRatings from '../../../../../models/server/prisma/Rating';
import { errorLogger, internalServerErrorLogger } from '../../../../../models/server/winston';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'GET') {
      const { bookId, userId } = req.query;
      const rater = new BookRatings(userId as string, bookId as string);
      try {
         const data = rater.getRatingByBook();
         return res.status(201).json({ success: true, data });
      } catch (err) {
         errorLogger(err, req);
         return res.end(err);
      }
   }
   if (req.method === 'POST') {
      const { id: userId, slug: bookId } = req.query;
      const { rating } = req.body;

      // console.log('DEBUGGING*****');
      // console.log('--------------------');
      // console.log('--------------------');
      // console.log('--------------------');
      // console.log('THE RATING IS: ', rating);
      // console.log('THE USERID IS: ', userId);

      const rater = new BookRatings(userId as string, bookId as string);
      try {
         rater.createOrUpdateRatings(rating as number);
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
