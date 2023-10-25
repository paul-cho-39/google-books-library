import { NextApiRequest, NextApiResponse } from 'next';
import googleApi, { MetaProps } from '@/models/_api/fetchGoogleUrl';
import { handleCacheKeys } from '@/utils/handleIds';
import lruCache, { StatusLRUType } from '@/utils/LRUcache';
import { fetcher } from '@/utils/fetchData';
import { Categories, categories } from '@/constants/categories';
import handleGoogleCache from '@/models/cache/handleGoogleCache';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   const category = req.query.slug as string;

   try {
      if (req.method === 'GET') {
         return await handleGoogleCache(res, category, {
            maxResultNumber: 15,
            pageIndex: 0,
            byNewest: true,
         });
      } else {
         throw new Error('Invalid request method');
      }
   } catch (error) {
      return res.status(500).json({ message: error || 'Internal Server Error' });
   }
}

// async function handleGoogleCache(res: NextApiResponse, category: string, meta: MetaProps) {
//    // lruCache.clear();
//    const { byNewest } = meta;
//    const cacheKey = byNewest
//       ? handleCacheKeys.recent.key(category.toLocaleLowerCase().replaceAll(' ', ''))
//       : handleCacheKeys.relevance.key(category.toLocaleLowerCase().replaceAll(' ', ''));

//    console.log(cacheKey);

//    const status: StatusLRUType = {};
//    let data = lruCache.get(cacheKey, { status: status });

//    console.log('THE DATA HERE IS FOUND ON: ', lruCache.calculatedSize);
//    console.log('THE DATA HERE IS FOUND ON: ', lruCache.getRemainingTTL(cacheKey));
//    console.log('DOES LRU CACHE HAVE: ', lruCache.has(cacheKey));

//    if (!data) {
//       console.log('HANDLING GOOGLE CACHE VIA API NOT CACHE');
//       try {
//          // passing meta here to whether save pageIndex but likely wont
//          const url = googleApi.getUrlBySubject(category as Categories, meta);

//          data = await fetcher(url);

//          if ((categories as unknown as string[]).includes(category.toUpperCase())) {
//             console.log('the data is now set');
//             lruCache.set(cacheKey, data, { status: status });
//          }
//       } catch (err) {
//          return res
//             .status(404)
//             .json({ message: `Error fetching data for category ${category}. ${err}` });
//       }
//    }

//    // console.log('status is : ', status);
//    return res.status(200).json({
//       data,
//       lastUpdated: status.start ? new Date(status.start).toISOString() : undefined,
//       source: status.get === 'hit' || status.get === 'stale' ? 'cache' : 'api',
//       cacheStatus: status,
//    });
// }
