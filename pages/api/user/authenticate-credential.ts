import type { NextApiRequest, NextApiResponse } from 'next';
import { createAccessToken, createRefreshToken, sendRefreshToken } from '@/lib/auth/token';
import prisma from '@/lib/prisma';
import { SHA256 } from 'crypto-js';

// page to authenticate user credential
// is authentication here necessary?
// Answer: this is NOT signup but for signing in
// so whenever signing in authenticate the credentails by calling this api route

// signing in authentication
// have to write one for providing credentials after user first signs up

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { email, password } = req.body;
      const hashedPassword = SHA256(password).toString();
      const user = await prisma.user.findUnique({
         where: { email: email },
         select: {
            id: true,
            name: true,
            email: true,
            password: true,
            username: true,
         },
      });
      // recreate client side by omitting the password
      const clientUser = {
         id: user?.id,
         name: user?.name,
         email: user?.email,
         username: user?.username,
      };

      // match the password and create a refreshtoken
      if (user && user.password === hashedPassword) {
         const refreshToken = createRefreshToken(user);
         const accessToken = createAccessToken(clientUser);
         refreshToken && sendRefreshToken(res, refreshToken as string);
         res.send({ user: clientUser, accessToken, refreshToken });
      } else {
         res.status(404).end('Invalid credentails');
      }
   }
}
