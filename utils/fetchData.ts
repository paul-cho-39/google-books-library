import router from 'next/router';
import { SignInForm } from '../lib/types/formInputsWithChildren';

type Data<T> = T extends SignInForm ? Partial<SignInForm> : string;
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

// this fetcher is mainly for googleAPI but can be used with nyt
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

export default fetchApiData;
