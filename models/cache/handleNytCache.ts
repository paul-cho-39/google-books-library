import { NextApiResponse } from 'next';
import { handleCacheKeys } from '@/utils/handleIds';
import lruCache, { StatusLRUType } from '@/utils/LRUcache';
import nytApi from '../_api/fetchNytUrl';
import { fetcher } from '@/utils/fetchData';

// have to use 503 to indicate when the api is hit too often for nyt;

export default async function handleNytCache(
   res: NextApiResponse,
   category: string,
   date?: 'current' | string
) {
   const key = date || 'current';
   const cat = category.toLocaleLowerCase();

   if (cat !== 'fiction' && cat !== 'nonfiction') {
      return res.status(404).end('Wrong type of categories were passed. Check the category');
   }

   const cacheKey =
      cat === 'fiction' ? handleCacheKeys.fiction.key(key) : handleCacheKeys.nonfiction.key(key);

   const status: StatusLRUType = {};

   const remainingSpace = lruCache.max - lruCache.size;

   let data = lruCache.get(cacheKey, { status: status });

   if (lruCache.has(cacheKey)) {
      try {
         // TODO: if date is provided have to change the date here
         const url = nytApi.getUrlByCategory({
            format: 'combined-print-and-e-book',
            type: cat,
         });

         data = await fetcher(url);

         if (data) {
            lruCache.set(cacheKey, data, { status: status });
         }
      } catch (err) {
         return res.status(404).json({
            message: `Error fetching data for category ${category} for New York Times best seller. ${err}`,
         });
      }
   }

   const result = !data ? 'FAILED' : 'SUCCESSFUL';

   return res.status(200).json({
      data,
      lastUpdated: status.start ? new Date(status.start).toISOString() : undefined,
      source: status.get === 'hit' || status.get === 'stale' ? 'cache' : 'api',
      cacheStatus: status,
   });
}
