import type { NextApiRequest, NextApiResponse } from 'next';
import BookRetriever from '../../../../models/server/prisma/BookRetrieve';
import RefineData from '../../../../models/server/refine/RefineData';
import { errorLogger, internalServerErrorLogger } from '../../../../models/server/winston';
import BookCreator, { UserBookWithoutId } from '../../../../models/server/prisma/BookCreator';
import BookStateHandler from '../../../../models/server/prisma/BookState';
import BookDelete from '../../../../models/server/prisma/BookDelete';

// this means also updating finishedBooks DATES if date is NULL
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'GET') {
      const { id: userId } = req.query;
      const getBooks = new BookRetriever();
      const refiner = new RefineData();
      try {
         const userBooks = await getBooks.getAllUserBooks(userId as string);
         const refinedBooks = refiner.refineBooks(userBooks);
         return res.status(200).json(refinedBooks);
      } catch (err) {
         errorLogger(err, req);
         return res.status(404).end(err);
      }
   }
   // there should be two different deletes?
   if (req.method === 'POST') {
      const { userId, id, year, month, day, ...data } = req.body;

      const creator = new BookCreator(userId, id);
      const stateData = BookStateHandler.getBookState('Finished', {
         year,
         month,
         day,
      });
      try {
         await creator.createOrUpdateBookAndState(data, stateData as UserBookWithoutId);
         return res.status(201).json({ success: true });
      } catch (err) {
         errorLogger(err, req);
         return res.end(err);
      }
   }
   if (req.method === 'DELETE') {
      const { id, userId } = req.body;
      const bookDelete = new BookDelete(userId, id);
      try {
         bookDelete.deleteBook();
         return res
            .status(200)
            .json({ success: true, method: req.method, message: 'Successfully deleted' });
      } catch (err) {
         errorLogger(err, req);
         return res.status(404).end(err);
      }
   } else {
      internalServerErrorLogger(req);
      return res.status(500).json({ message: 'Internal server error' });
   }
}
