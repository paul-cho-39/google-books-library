import { NextApiRequest, NextApiResponse } from 'next';
import nytApi, { NytCategoryTypes } from '@/models/_api/fetchNytUrl';
import { throttledFetcher } from '@/utils/fetchData';
import { errorLogger } from '@/models/server/winston';

type ResponseType = {
   success: boolean;
   data: Record<string, unknown>;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
   const category = req.query.slug as NytCategoryTypes;

   if (req.method === 'GET') {
      try {
         const url = nytApi.getUrlByCategory({
            type: category,
            format: 'combined-print-and-e-book',
         });
         const response = await throttledFetcher(url);
         return res.status(200).json({ success: true, data: response });
      } catch (err) {
         errorLogger(err, req);
      }
   } else {
      throw new Error('Invalid request method');
   }
}
