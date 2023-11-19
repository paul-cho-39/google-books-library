import type { NextApiRequest, NextApiResponse } from 'next';
import { createAccessToken, sendRefreshToken, createRefreshToken } from '@/lib/auth/token';
import { JwtPayload, verify } from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// use getToken for verification?

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      console.log('req headers for cookie: ', req.headers.cookie);
      const secret = process.env.NEXTAUTH_SECRET;
      const { token } = req.body;
      const payload = verify(token.accessToken, process.env.NEXTAUTH_SECRET as string);

      if (!payload) return res.send({ ok: false, accessToken: '' });
      try {
         // decode and verify
         const jwtPayload = payload as JwtPayload; // declaring so it is not a string
         const userId = jwtPayload.userId;
         const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true },
         });

         if (!user) return res.send({ ok: false, accessToken: '' });
         const refreshToken = createRefreshToken(user);
         // possibly cut this part out
         user && sendRefreshToken(res, refreshToken as string);
         const accessToken = createAccessToken(user);
         res.send({
            ok: true,
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user,
         });
      } catch (e) {
         console.error(e);
      }
   } else {
      res.status(500).send({ ok: false });
   }
}
