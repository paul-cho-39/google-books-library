import type { NextApiRequest, NextApiResponse } from 'next';
import createApiResponse from '@/models/server/response/apiResponse';
import BookService from '@/models/server/service/BookService';

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
   if (req.method === 'DELETE') {
      const { id: userId } = req.query as { id: string };
      const { id } = req.body;

      const service = new BookService(userId, id);
      try {
         await service.deleteBook();
         return res.status(204).end();
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).end(errorResponse);
      }
   } else {
      const errorResponse = createApiResponse(null, {}, { code: 500 });
      return res.status(500).json(errorResponse);
   }
}
