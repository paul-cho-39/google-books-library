import type { NextApiRequest, NextApiResponse } from 'next';
import BookRetriever from '../../../models/server/prisma/BookRetrieve';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { bookIds } = req.body;
      const retriever = new BookRetriever();
      // bookIds should be of string[]
      try {
         await retriever.getBatchRatings(bookIds as string[]);
      } catch (err) {}
   } else {
   }
}
