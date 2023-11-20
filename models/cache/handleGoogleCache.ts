import { NextApiResponse } from 'next';
import { Categories, categories } from '@/constants/categories';
import lruCache, { StatusLRUType } from '@/utils/LRUcache';
import { fetcher, throttledFetcher } from '@/utils/fetchData';
import { handleCacheKeys } from '@/utils/handleIds';
import googleApi, { MetaProps } from '../_api/fetchGoogleUrl';
import assert from 'assert';
import { CategoriesQueries, CategoryQuery } from '@/lib/types/serverTypes';

export default async function handleGoogleCache(
   res: NextApiResponse,
   category: string,
   meta: MetaProps
) {
   // lruCache.clear();
   const { byNewest } = meta;
   const cacheKey = byNewest
      ? handleCacheKeys.recent.key(category.toLocaleLowerCase().replaceAll(' ', ''))
      : handleCacheKeys.relevance.key(category.toLocaleLowerCase().replaceAll(' ', ''));

   const status: StatusLRUType = {};
   let data = lruCache.get(cacheKey, { status: status });
   const remainingSpace = lruCache.max - lruCache.size;

   if (!data) {
      try {
         // passing meta here to whether save pageIndex but likely wont
         const url = googleApi.getUrlBySubject(category as Categories, meta);

         data = await throttledFetcher(url);

         //  if ((categories as unknown as string[]).includes(category.toUpperCase())) {

         if (data) {
            lruCache.set(cacheKey, data, { status: status });
         }
         //  }
      } catch (err) {
         return res
            .status(404)
            .json({ message: `Error fetching data for category ${category}. ${err}` });
      }
   }

   const result = lruCache.has(cacheKey) ? 'FAILED' : 'SUCCESSFUL';

   return res.status(200).json({
      data,
      lastUpdated: status.start ? new Date(status.start).toISOString() : undefined,
      source: status.get === 'hit' || status.get === 'stale' ? 'cache' : 'api',
      cacheStatus: status,
   });
}
