import type { NextApiRequest, NextApiResponse } from 'next';
import BookService from '@/models/server/service/BookService';
import createApiResponse from '@/models/server/response/apiResponse';

// this means also updating finishedBooks DATES if date is NULL
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { id: userId } = req.query as { id: string };
      const { year, month, day, data } = req.body;

      const service = new BookService(userId, data.id);
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
}
