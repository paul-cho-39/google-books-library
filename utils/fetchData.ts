import router from 'next/router';
import { IncomingMessage } from 'http';
import { GOOGLE_THROTTLE_TIME, NYT_THROTTLE_TIME } from '../constants/throttle';
import { GoogleUpdatedFields, Items } from '../lib/types/googleBookTypes';
import { BestSellerData, ReviewData } from '../lib/types/nytBookTypes';
import { ReturnedCacheData } from '../lib/types/serverTypes';
import { ApiRequestOptions, Method, UrlProps } from '../lib/types/fetchbody';
import API_ROUTES from './apiRoutes';

import { throttle } from 'lodash';

type Request = IncomingMessage & {
   cookies: Partial<{
      [key: string]: string;
   }>;
};

export type FetchCacheType = {
   source: 'google' | 'nyt';
   endpoint: 'relevant' | 'recent' | 'best-seller';
   category: string;
};

async function apiRequest<T, TData>(options: ApiRequestOptions<T>): Promise<TData> {
   const { apiUrl, method, data, headers, shouldRoute, routeTo, delay } = options;

   try {
      const response = await fetch(apiUrl, {
         method,
         headers: { 'Content-Type': 'application/json', ...headers },
         body: JSON.stringify(data),
      });

      // Handle response status
      if (!response.ok) {
         throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Special handling for POST and PUT requests with routing
      if ((method === 'POST' || method === 'PUT') && shouldRoute && routeTo) {
         setTimeout(() => {
            router.push(routeTo);
         }, delay ?? 0);
      }

      return response.json() as Promise<TData>;
   } catch (error: any) {
      console.error(`API Request Error: ${error.message}`);
      throw error;
   }
}

// this fetcher is mainly for googleAPI and can be used with nyt
export const fetcher = async (input: RequestInfo, init?: RequestInit) => {
   try {
      const headers = {
         ...init?.headers,
         'Accept-Encoding': 'gzip',
         'User-Agent': 'YourAppName/1.0 (gzip)',
      };

      const res = await fetch(input, {
         ...init,
         headers,
      });

      if (res.status === 429) {
         throw new Error('API rate limit exceeded. Please try again later.');
      }

      if (!res.ok || res.status === 400) {
         throw new Error('Cannot be fetched');
      }

      return res.json();
   } catch (error) {
      console.error(`Cannot fetch the following url: ${input}. Request error: ${error}`);
   }
};

export const throttledFetcher = (input: RequestInfo, init?: RequestInit) => {
   const isNYT = input.toString().includes('api.nytimes.com');
   // debugging
   console.log('the url is: ', isNYT);

   const fetcherFunction = async () => fetcher(input, init);

   if (isNYT) {
      return throttle(fetcherFunction, NYT_THROTTLE_TIME)();
   } else {
      return throttle(fetcherFunction, GOOGLE_THROTTLE_TIME)();
   }
};

export const getAbsoluteUrl = (req: Request) => {
   const protocol = req.headers['x-forwarded-proto'] || 'http';
   const host = req.headers['x-forwarded-host'] || req.headers['host'];
   return `${protocol}://${host}`;
};

// fetching data from the server
export const fetchDataFromCache = async <
   CacheData extends GoogleUpdatedFields | ReviewData<BestSellerData>
>(
   type: FetchCacheType,
   req?: Request
): Promise<ReturnedCacheData<CacheData>> => {
   let baseUrl = '';
   const url = API_ROUTES.THIRD_PARTY.path(type);
   if (req) {
      baseUrl = getAbsoluteUrl(req);
   }

   const res = await apiRequest<null, ReturnedCacheData<CacheData>>({
      apiUrl: `${baseUrl}/${url}`,
      method: 'GET',
   });

   return res;
};

// fetcher for user update
export const bookApiUpdate = async <T>(
   method: Method,
   userId: string,
   subdomain: UrlProps,
   body?: Record<string, unknown> | string
): Promise<T> => {
   const res = await apiRequest<typeof body, T>({
      apiUrl: API_ROUTES.BOOKS.path(userId, subdomain),
      method: method,
      data: body,
      shouldRoute: false,
   });

   return res;
};

export default apiRequest;
