import { NextApiRequest, NextApiResponse } from 'next';
import googleApi, { MetaProps } from '../../../../../models/_api/fetchGoogleUrl';
import { handleCacheKeys } from '../../../../../utils/handleIds';
import lruCache, { StatusLRUType } from '../../../../../utils/LRUcache';
import { throttledFetcher } from '../../../../../utils/fetchData';
import { Categories, categories } from '../../../../../constants/categories';
import { ComputerDesktopIcon } from '@heroicons/react/20/solid';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   const category = req.query.slug as string;

   try {
      if (req.method === 'GET') {
         res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
         return await handleGoogleCache(res, category, {
            maxResultNumber: 15,
            pageIndex: 0,
            byNewest: false,
         });
      } else {
         throw new Error('Invalid request method');
      }
   } catch (error) {
      return res.status(500).json({ message: error || 'Internal Server Error' });
   }
}

async function handleGoogleCache(res: NextApiResponse, category: string, meta: MetaProps) {
   // lruCache.clear();
   const { byNewest } = meta;
   const cacheKey = byNewest
      ? handleCacheKeys.recent.key(category.toLocaleLowerCase().replaceAll(' ', ''))
      : handleCacheKeys.relevance.key(category.toLocaleLowerCase().replaceAll(' ', ''));

   console.log(cacheKey);

   const status: StatusLRUType = {};
   let data = lruCache.get(cacheKey, { status: status });
   const remainingSpace = lruCache.max - lruCache.size;

   console.log('-----------------------STARTING HERE---------------------------');
   console.log('THE AMOUNT OF SPACE REMAINING IN IS:', remainingSpace);
   console.log('---------------------------------------');
   console.log('THE CACHEKEY IS: ', cacheKey);
   console.log('---------------------------------------');
   console.log('THE AMOUNT OF MAX IS:', lruCache.size);
   console.log('---------------------------------------');
   console.log('THE DATA CONTAINS THE KEY', cacheKey, '?', lruCache.has(cacheKey));
   console.log('---------------------------------------');
   console.log('---------------------------------------');

   if (!data) {
      console.log('HANDLING GOOGLE CACHE VIA API');
      try {
         // passing meta here to whether save pageIndex but likely wont
         const url = googleApi.getUrlBySubject(category as Categories, meta);

         data = await throttledFetcher(url);

         //  if ((categories as unknown as string[]).includes(category.toUpperCase())) {

         if (data) {
            lruCache.set(cacheKey, data, { status: status });
            console.log('SET THE LRU CACHE');
         }
         //  }
      } catch (err) {
         return res
            .status(404)
            .json({ message: `Error fetching data for category ${category}. ${err}` });
      }
   }

   const result = lruCache.has(cacheKey) ? 'FAILED' : 'SUCCESSFUL';
   console.log('the status is: ', status);

   return res.status(200).json({
      data,
      lastUpdated: status.start ? new Date(status.start).toISOString() : undefined,
      source: status.get === 'hit' || status.get === 'stale' ? 'cache' : 'api',
      cacheStatus: status,
   });
}
