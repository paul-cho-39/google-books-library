import { NextApiRequest, NextApiResponse } from 'next';
import googleApi, { MetaProps } from '@/models/_api/fetchGoogleUrl';
import { throttledFetcher } from '@/utils/fetchData';
import { CategoryRequestQuery } from '@/lib/types/fetchbody';
import { errorLogger } from '@/models/server/winston';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      const { slug: id } = req.query as CategoryRequestQuery;
      const { type } = req.body;
      try {
         const url = type === 'google' ? googleApi.getUrlByBookId(id) : googleApi.getUrlByIsbn(id);
         const data = await throttledFetcher(url);

         console.log('the current data is: ', data);
         return res.status(200).json({ success: true, data: data });
      } catch (error) {
         return errorLogger(error, req);
      }
   } else {
      return res.status(500).json({ message: 'Internal Server Error' });
   }
}
