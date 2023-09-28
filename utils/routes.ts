import queryKeys from '../lib/queryKeys';
import { MetaProps } from '../models/_api/fetchGoogleUrl';

const ROUTES = {
   HOME: '/',
   AUTH: {
      SIGNIN: 'auth/signin',
      SIGNUP: '/auth',
   },
   AUTHORS: (slug: string) => `/author/${slug}`,
   BOOKS: {
      NYT: (slug: string) => `/books/new-york-times/${slug}`,
      GOOGLE: (slug: string) => `/books/${slug}`,
   },
   CATEGORIES: (slug: string) => `/categories/${slug}`,
   PROFILE: {
      SETTINGS: (id: number | string) => `/profile/${id}`,
   },
};

export const encodeRoutes = {
   home: (category: string, meta: MetaProps) => {
      return {
         from: 'home',
         fromQuery: category,
         maxResultNumber: meta.maxResultNumber,
         pageIndex: meta.pageIndex,
         byNewest: meta.byNewest,
      };
   },
   search: (search: string) => {
      return {
         from: 'search',
         fromQuery: search,
      };
   },
   category: (category: string, meta: MetaProps) => {
      return {
         from: 'category',
         fromQuery: category,
         maxResultNumber: meta.maxResultNumber,
         pageIndex: meta.pageIndex,
         byNewest: meta.byNewest,
      };
   },
} as const;

export const decodeRoutes = {
   home: (category: string, meta?: MetaProps) => queryKeys.categories(category, meta),
   search: (search: string) => queryKeys.bookSearch(search),
   category: (category: string, meta?: MetaProps) => queryKeys.categories(category, meta),
};

export default ROUTES;
