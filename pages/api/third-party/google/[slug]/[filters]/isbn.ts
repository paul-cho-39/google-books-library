import { NextApiRequest, NextApiResponse } from 'next';
import googleApi, { MetaProps } from '@/models/_api/fetchGoogleUrl';
import { throttledFetcher } from '@/utils/fetchData';
import { SearchRequestQuery } from '@/lib/types/fetchbody';
import { errorLogger } from '@/models/server/winston';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const query = req.query as SearchRequestQuery;
      try {
         const url = googleApi.getUrlByIsbn(query.slug);
         const data = await throttledFetcher(url);
         return res.status(200).json({ success: true, data: data });
      } catch (error) {
         return errorLogger(error, req);
      }
   } else {
      return res.status(500).json({ message: 'Internal Server Error' });
   }
}
