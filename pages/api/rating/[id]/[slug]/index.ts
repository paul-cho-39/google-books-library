import type { NextApiRequest, NextApiResponse } from 'next';
import BookService from '@/models/server/service/BookService';
import createApiResponse from '@/models/server/response/apiResponse';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'GET') {
      const { id: userId, slug: bookId } = req.query;
      const service = new BookService(userId as string, bookId as string);
      try {
         const ratingData = await service.getAllRatingOfSingleBook(bookId as string);
         const response = createApiResponse<typeof ratingData>(ratingData, {
            message: 'all ratings from single book',
         });
         return res.status(201).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).json(errorResponse);
      }
   }
   if (req.method === 'POST') {
      const { id: userId, slug: bookId } = req.query;
      const service = new BookService(userId as string, bookId as string);
      const {
         data: { bookData, rating },
      } = req.body;
      try {
         service.handleCreateBookAndRating(bookData, rating as number);
         const response = createApiResponse(null);
         return res.status(201).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).json(errorResponse);
      }
   }
   if (req.method === 'DELETE') {
      const { id: userId, slug: bookId } = req.query;
      const service = new BookService(userId as string, bookId as string);
      try {
         service.deleteSingleRating();
         const response = createApiResponse(null, {
            message: 'Deleted rating',
         });
         return res.status(201).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).json(errorResponse);
      }
   }
   const errorResponse = createApiResponse(null, {}, { code: 500 });
   res.status(500).json(errorResponse);
}
