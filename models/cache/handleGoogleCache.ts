import { NextApiResponse } from 'next';
import { Categories, categories } from '../../constants/categories';
import lruCache, { StatusLRUType } from '../../lib/LRUcache';
import { fetcher } from '../../utils/fetchData';
import { handleCacheKeys } from '../../utils/handleIds';
import googleApi, { MetaProps } from '../_api/fetchGoogleUrl';
import assert from 'assert';
import { CategoriesQueries, CategoryQuery } from '../../lib/types/serverPropsTypes';

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

   console.log(cacheKey);

   const status: StatusLRUType = {};
   let data = lruCache.get(cacheKey, { status: status });
   const remainingSpace = lruCache.max - lruCache.size;

   console.log('-----------------------STARTING HERE---------------------------');
   console.log('---------------------------------------');
   console.log('---------------------------------------');
   console.log('---------------------------------------');

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

         data = await fetcher(url);

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

export async function batchFetchGoogleCategories(cats: readonly string[], meta: MetaProps) {
   const googleData: CategoriesQueries | CategoryQuery = {};

   await Promise.all(
      cats.map(async (category) => {
         const catLowerCase = category.toLowerCase();
         const url = googleApi.getUrlBySubject(catLowerCase, meta);

         try {
            const res = await fetcher(url);
            googleData[catLowerCase] = res;
         } catch (error) {
            console.error('Error fetching data for category:', category, error);
            googleData[catLowerCase] = null;
         }
      })
   );

   return googleData;
}
