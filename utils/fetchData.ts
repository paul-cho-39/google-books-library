import router from 'next/router';
import { SignInForm } from '../lib/types/forms';
import { NextApiRequest } from 'next';
import { IncomingMessage } from 'http';
import { Categories } from '../constants/categories';
import { GoogleUpdatedFields } from '../lib/types/googleBookTypes';
import { BestSellerData, ReviewData } from '../lib/types/nytBookTypes';
import { ReturnedCacheData } from '../lib/types/serverPropsTypes';
import { MetaProps } from '../models/_api/fetchGoogleUrl';

export type Data<T> = T extends SignInForm ? Partial<SignInForm> : string;
export type Method = 'PUT' | 'POST' | 'GET' | 'DELETE';

interface ParamProps<T> {
   url: string;
   method: Method;
   data?: Data<T>;
   options?: {
      shouldRoute?: boolean;
      routeTo?: string;
      delay?: number;
   };
}

type Request = IncomingMessage & {
   cookies: Partial<{
      [key: string]: string;
   }>;
};

export type FetchCacheType = {
   source: 'google' | 'nyt';
   endpoint: 'relevant' | 'recent' | 'best-seller';
   req?: Request;
};

async function fetchApiData<T>({
   url,
   method,
   data,
   options = {
      shouldRoute: true,
      routeTo: '/',
      delay: 0,
   },
}: ParamProps<T>) {
   const apiBaseUrl = '/api';
   await fetch(apiBaseUrl + url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
   }).then((res) => {
      if (!res.ok || res.status === 400 || res.status === 404) {
         throw new Error(`${data} cannot be found`);
      }
      if ((res.ok && method === 'POST') || (res.ok && method === 'PUT')) {
         setTimeout(() => {
            options.shouldRoute && options.routeTo && router.push(options.routeTo);
         }, options.delay ?? 0);
      }
      if (method === 'GET') {
         return res.json();
      }
   });
}

// this fetcher is mainly for googleAPI and can be used with nyt
export const fetcher = async (input: RequestInfo, init?: RequestInit) => {
   try {
      // debugging
      console.log('the url is: ', input);

      const headers = {
         ...init?.headers,
         'Accept-Encoding': 'gzip',
         'User-Agent': 'YourAppName/1.0 (gzip)',
      };

      const res = await fetch(input, {
         ...init,
         headers,
      });

      if (!res.ok || res.status === 400) {
         throw new Error('Cannot be fetched');
      }
      return res.json();
   } catch (error) {
      console.log(error);
   }
};

export const getAbsoluteUrl = (req: Request) => {
   const protocol = req.headers['x-forwarded-proto'] || 'http';
   const host = req.headers['x-forwarded-host'] || req.headers['host'];
   return `${protocol}://${host}`;
};

export const fetchDataFromCache = async <
   CacheData extends GoogleUpdatedFields | ReviewData<BestSellerData>
>(
   category: Categories | string,
   type: FetchCacheType,
   date?: string
): Promise<ReturnedCacheData<CacheData>> => {
   const { source, endpoint, req } = type;
   let baseUrl = '';
   if (req) {
      baseUrl = getAbsoluteUrl(req);
   }

   const res = await fetch(`${baseUrl}/api/third-party/${source}/${category}/${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(meta ?? date),
   });

   if (!res.ok || res.status === 500 || res.status === 404) {
      throw new Error(`Failed to fetch the cached ${source} data `);
   }

   return res.json();
};

export default fetchApiData;
