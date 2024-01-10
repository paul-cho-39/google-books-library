import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import BookService from '@/models/server/service/BookService';
import createApiResponse from '@/models/server/response/apiResponse';

export default async function reading(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { id: userId } = req.query as { id: string };
      const { data } = req.body;

      const service = new BookService(userId, data.id);
      try {
         await service.handleCreateReading(data);
         const response = createApiResponse(null, {
            message: 'Added / updated book status to reading',
         });
         return res.status(200).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).json(errorResponse);
      }
   }
   if (req.method === 'PUT') {
      // make sure that it doesnt add duplicates
      const { id, userId } = req.body;
      const service = new BookService(userId, id);
      try {
         await service.handlePrimary();
         const response = createApiResponse(null, { message: 'Book primary status changed' });
         return res.status(201).json(response);
      } catch (error: any) {
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new Error('Book does not exist for this user.');
         }
         const errorResponse = createApiResponse(null, {}, { code: 404, message: error.message });
         return res.status(404).json(errorResponse);
      }
   }
   const errorResponse = createApiResponse(null, {}, { code: 500 });
   res.status(500).json(errorResponse);
}
