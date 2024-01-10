import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';
import createApiResponse from '@/models/server/response/apiResponse';

export default async function replyToComment(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { id, slug: userId } = req.query as unknown as { id: string; slug: string };
      const { comment } = req.body as { comment: string };
      try {
         if (!comment || typeof comment !== 'string' || comment.length > 500) {
            return res.status(400).json({ error: 'Invalid input for comment' });
         }
         const commentId = parseInt(id);
         const updatedComment = await prisma.$transaction(async (tx) => {
            await tx.session.findFirstOrThrow({
               where: { userId: userId },
            });

            // in case the user wants to revert back?
            const oldComment = await tx.comment.findFirst({
               where: { id: commentId },
               select: { content: true },
            });

            const updatedComment = await tx.comment.update({
               where: {
                  id: commentId,
               },
               data: {
                  // dateUpdated field is automatically updated
                  content: comment,
               },
            });

            return { oldComment, updatedComment };
         });

         const response = createApiResponse<typeof updatedComment>(updatedComment, {
            message: 'Updated new comment successfully',
            options: {},
         });
         return res.status(200).json(response);
      } catch (err: any) {
         const errorResponse = createApiResponse(null, {}, { code: 404, message: err.message });
         return res.status(404).json(errorResponse);
      }
   }

   const errorResponse = createApiResponse(null, {}, { code: 500 });
   res.status(500).json(errorResponse);
}
