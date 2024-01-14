import type { NextApiRequest, NextApiResponse } from 'next';

import { serialize, parse } from 'cookie';
import prisma from '@/lib/prisma';
import { JWT, decode } from 'next-auth/jwt';

type TokenParams = JWT & {
   credentials?: boolean;
   sessionToken?: string;
};

/**
 * @description API endpoint for custom Credentials signout. First, checks the 'sessionToken' and
 * proceeds to check by decoding the token. If the decoded 'sessionToken' matches the database, it proceeds
 * to signout the user.
 */
export default async function signOut(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const cookies = req.headers.cookie;

      if (!cookies) {
         return res.status(404).json({ message: 'No cookies found in the headers' });
      }

      // retrieve the session cookies that will be matched with the database
      const parsedCookies = parse(cookies);
      const token = parsedCookies['next-auth.session-token'];

      const decoded = (await decode({
         secret: process.env.NEXTAUTH_SECRET as string,
         token,
      })) as TokenParams;

      if (!decoded) {
         return res.status(404).json({ message: 'The following cookie is not authenticated' });
      }

      const sessionToken = decoded.sessionToken;

      try {
         await prisma.session.delete({
            where: { sessionToken: sessionToken as string },
         });

         // clear the cookie on the client side
         // it is likely though the 'signOut' already takes care of this behavior
         res.setHeader(
            'Set-Cookie',
            serialize('next-auth.session-token', '', {
               maxAge: -1, // expire the cookie
               path: '/',
            })
         );

         res.status(200).json({ message: 'Signed out successfully' });
      } catch (err) {
         console.error('Error deleting the session token', err);
      }
   } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
   }
}
