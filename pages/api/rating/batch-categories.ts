import type { NextApiRequest, NextApiResponse } from 'next';
import retriever from '@/models/server/prisma/BookRetrieve';
import { errorLogger, internalServerErrorLogger } from '@/models/server/winston';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { bookIds } = req.body;
      try {
         const data = await retriever.getBatchRatingsByBooks(bookIds as string[]);
         res.status(200).json({ success: true, data: data });
      } catch (err) {
         errorLogger(err, req);
      }
   } else {
      internalServerErrorLogger(req);
      return res.status(500).end({ message: 'Internal Server Error' });
   }
}
