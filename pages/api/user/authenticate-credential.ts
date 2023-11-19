import type { NextApiRequest, NextApiResponse } from 'next';
import { createAccessToken, createRefreshToken, sendRefreshToken } from '@/lib/auth/token';
import prisma from '@/lib/prisma';
import { SHA256 } from 'crypto-js';
import { User } from 'next-auth';

// page to authenticate user credential
// for email credential only sending accessToken and refreshToken
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
      const clientUser: User = {
         id: user?.id as string,
         name: user?.name,
         email: user?.email,
         // username: user?.username,
      };

      // match the password and create a refreshtoken
      if (user && user.password === hashedPassword) {
         try {
            const refreshToken = createRefreshToken(user);
            const accessToken = createAccessToken(clientUser);
            refreshToken && sendRefreshToken(res, refreshToken as string);
            res.send({ user: clientUser, accessToken, refreshToken });
         } catch (err) {
            res.status(404).end('Invalid credentails: Provide the correct token');
         }
      } else {
         res.status(500).end('Invalid server');
      }
   }
}
