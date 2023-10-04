import type { NextApiRequest, NextApiResponse } from 'next';
import BookRatings from '../../../../../models/server/prisma/Rating';
import { errorLogger, internalServerErrorLogger } from '../../../../../models/server/winston';
import BookRetriever from '../../../../../models/server/prisma/BookRetrieve';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'GET') {
      const { bookId, userId } = req.query;
      const retrieve = new BookRetriever();
      try {
         const data = await retrieve.getRatingByBook(bookId as string);
         const inLibrary = data.length > 0;
         return res.status(201).json({
            success: true,
            totalItems: data.length,
            data: data,
            inLibrary: inLibrary,
         });
      } catch (err) {
         errorLogger(err, req);
         return res.end(err);
      }
   }
   if (req.method === 'POST') {
      const { id: userId, slug: bookId } = req.query;
      const {
         data: { bookData, rating },
      } = req.body;

      // console.log('DEBUGGING*****');
      // console.log('--------------------');
      // console.log('--------------------');
      // console.log('--------------------');
      // console.log('THE DATA IS: ', bookData);
      // console.log('THE RATING IS: ', rating);

      const rater = new BookRatings(userId as string, bookId as string);
      try {
         rater.upsertBookAndRating(bookData, rating as number);
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
