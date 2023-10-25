import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const session = getSession(req.body);
      console.log(session);
      try {
         // will already know the data right?
         const { userId, firstName, lastName } = req.body;
         const fullName = firstName + lastName;
         const updateUserName = await prisma.user.upsert({
            where: { id: userId },
            create: { name: fullName },
            update: {
               name: fullName,
            },
         });
         res.status(201).json(updateUserName);
      } catch (e) {
         res.status(400).json({ message: 'Failed to change the name' });
      }
   } else {
      res.status(400).json({ message: 'Try a different request method' });
   }
}
