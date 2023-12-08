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

      //** Cannot change next-auth data. Not able to write to database with predefined schema for next-auth */
      // if (providers?.google || providers?.facebook) {
      //   const unverfiedUser = await prisma.user.findFirst({
      //     where: {
      //       email: email,
      //       emailVerified: null,
      //     },
      //     select: { email: true },
      //   });
      //   // require other error boundaries?
      //   if (unverfiedUser && unverfiedUser !== null) {
      //     const verifiedUser = await prisma.user.upsert({
      //       where: { email: unverfiedUser.email as string },
      //       create: { emailVerified: dateVerified },
      //       update: { emailVerified: dateVerified },
      //     });
      //     res.status(201).json(verifiedUser);
      //   } else {
      //     return
      //   }
      // }

      // are there more conditions before creating the user?
      // if email and username is not duplicated
      // if (!emailInData?.includes(email) && !usernameInData?.includes(username)) {
      const hasehdPassword = SHA256(password).toString();
      try {
         await prisma.user.create({
            data: {
               username,
               email,
               password: hasehdPassword,
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
