import type { NextApiRequest, NextApiResponse } from 'next';
import BookService from '../../../../../models/server/service/BookService';
import createApiResponse from '../../../../../models/server/response/apiResponse';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   const { id: userId, slug: bookId } = req.query;
   const service = new BookService(userId as string, bookId as string);
   if (req.method === 'GET') {
      try {
         const ratingData = await service.getAllRatingOfSingleBook(bookId as string);
         const response = createApiResponse<typeof ratingData>(ratingData, {
            message: 'all ratings from single book',
         });
         res.status(201).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).end(errorResponse);
      }
   }
   if (req.method === 'POST') {
      const {
         data: { bookData, rating },
      } = req.body;
      try {
         service.handleCreateBookAndRating(bookData, rating as number);
         const response = createApiResponse(null);
         return res.status(201).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).end(errorResponse);
      }
   }
   if (req.method === 'DELETE') {
      try {
         service.deleteSingleRating();
         const response = createApiResponse(null, {
            message: 'Deleted rating',
         });
         return res.status(201).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).end(errorResponse);
      }
   } else {
      const errorResponse = createApiResponse(null, {}, { code: 500 });
      return res.status(500).json(errorResponse);
   }
}
