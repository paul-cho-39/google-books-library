import { NextApiResponse } from 'next';
import { handleCacheKeys } from '../../utils/handleIds';
import lruCache, { StatusLRUType } from '../../utils/LRUcache';
import nytApi from '../_api/fetchNytUrl';
import { fetcher } from '../../utils/fetchData';

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

   console.log('-----------------------STARTING HERE---------------------------');
   console.log('THE AMOUNT OF SPACE REMAINING IN IS:', remainingSpace);
   console.log('---------------------------------------');
   console.log('THE AMOUNT OF MAX IS:', lruCache.size);
   console.log('---------------------------------------');
   console.log('THE DATA CONTAINS THE KEY', cacheKey, '?', lruCache.has(cacheKey));
   console.log('---------------------------------------');
   console.log('---------------------------------------');

   if (lruCache.has(cacheKey)) {
      try {
         console.log('HANDLING NEW YORK TIMES DATA VIA API');
         // TODO: if date is provided have to change the date here
         const url = nytApi.getUrlByCategory({
            format: 'combined-print-and-e-book',
            type: cat,
         });

         data = await fetcher(url);

         if (data) {
            lruCache.set(cacheKey, data, { status: status });
            console.log('SET THE LRU CACHE');
         }
      } catch (err) {
         return res.status(404).json({
            message: `Error fetching data for category ${category} for New York Times best seller. ${err}`,
         });
      }
   }

   const result = !data ? 'FAILED' : 'SUCCESSFUL';
   console.log('NYT', cacheKey, result);
   console.log('the status is: ', status);
   return res.status(200).json({
      data,
      lastUpdated: status.start ? new Date(status.start).toISOString() : undefined,
      source: status.get === 'hit' || status.get === 'stale' ? 'cache' : 'api',
      cacheStatus: status,
   });
}
