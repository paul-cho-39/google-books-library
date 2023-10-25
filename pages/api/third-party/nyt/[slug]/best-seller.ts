import { NextApiRequest, NextApiResponse } from 'next';
import handleNytCache from '@/models/cache/handleNytCache';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   const category = req.query.slug as string;

   try {
      if (req.method === 'GET') {
         return await handleNytCache(res, category);
      } else {
         throw new Error('Invalid request method');
      }
   } catch (error) {
      return res.status(500).json({ message: error || 'Internal Server Error' });
   }
}
