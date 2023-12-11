import { SHA256 } from 'crypto-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'DELETE') {
      const id = req.body;
      try {
         const deletedUser = await prisma.user.delete({
            where: { id: id },
         });
         res.status(204).end();
      } catch (e) {
         res.status(401).json({ message: 'Failed to delete this account' });
      }
   } else {
      return res.status(501).json({ message: 'Method Not Allowed' });
   }
}
