import type { NextApiRequest, NextApiResponse } from 'next';
import BookService from '../../../../../models/server/service/BookService';
import createApiResponse from '../../../../../models/server/response/apiResponse';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { id: userId, slug: bookId } = req.query;
      const { rating } = req.body;
      const service = new BookService(userId as string, bookId as string);
      try {
         service.handleUpdateRating(rating as number);
         const response = createApiResponse(null);
         return res.status(201).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).json(errorResponse);
      }
   } else {
      const errorResponse = createApiResponse(null, {}, { code: 500 });
      res.status(500).json(errorResponse);
   }
}
