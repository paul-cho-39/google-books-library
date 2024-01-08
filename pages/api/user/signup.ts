import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getProviders } from 'next-auth/react';
import { SHA256 } from 'crypto-js';
import sendMail from '@/lib/auth/email/sendMail';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   // do not have to include here
   // fetch all email and include in the resolver
   const users = await prisma.user.findMany({
      select: {
         email: true,
         username: true,
      },
   });
   // this does not work
   if (req.method === 'POST') {
      // const providers = await getProviders();
      // for updated date
      const dateVerified = new Date().toISOString();
      const { username, email, password } = req.body;

      const userExists = await prisma.user.findMany({
         where: {
            OR: [{ username: username }, { email: email }],
         },
      });

      if (userExists && userExists.length > 1) {
         return res.status(403).json({ message: 'Duplicate username or email' });
      }

      const hasehdPassword = SHA256(password).toString();
      try {
         const user = await prisma.user.create({
            data: {
               username,
               email,
               password: hasehdPassword,
            },
         });

         await prisma.account.create({
            data: {
               userId: user.id,
               type: 'credentials',
               provider: 'credentials',
               providerAccountId: user.id,
            },
         });

         res.status(201).json({ success: true });
      } catch (e) {
         res.status(401).json({
            success: false,
            message: 'Failed to create a new account',
            error: e,
         });
      }
   } else {
      res.status(500).end();
   }
}
