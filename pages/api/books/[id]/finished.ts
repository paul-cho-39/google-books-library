import type { NextApiRequest, NextApiResponse } from 'next';
import BookService from '../../../../models/server/service/BookService';
import createApiResponse from '../../../../models/server/response/apiResponse';

// this means also updating finishedBooks DATES if date is NULL
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'GET') {
      const { id: userId } = req.query;
      try {
         const service = new BookService();
         const refinedBooks = await service.getUserBooks(userId as string);
         const response = createApiResponse<typeof refinedBooks>(refinedBooks);
         return res.status(200).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).end(errorResponse);
      }
   }
   if (req.method === 'POST') {
      const { userId, id, year, month, day, ...data } = req.body;

      const service = new BookService(userId, id);
      try {
         await service.handleCreateFinished(data, year, month, day);
         const response = createApiResponse(null);
         return res.status(201).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(
            null,
            {
               message: 'Added / updated book status to finished',
            },
            { code: 404, message: err.message }
         );
         return res.status(404).end(errorResponse);
      }
   }
   if (req.method === 'DELETE') {
      const { id, userId } = req.body;
      const service = new BookService(userId, id);
      try {
         await service.deleteBook();
         const response = createApiResponse(null, {
            message: 'deleted book from database',
         });
         return res.status(200).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).end(errorResponse);
      }
   } else {
      const errorResponse = createApiResponse(null, {}, { code: 500 });
      return res.status(500).json(errorResponse);
   }
}
