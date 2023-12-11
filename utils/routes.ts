import { FilterProps } from '@/lib/types/googleBookTypes';
import queryKeys from './queryKeys';
import { MetaProps } from '@/models/_api/fetchGoogleUrl';
import { NextRouter } from 'next/router';

const ROUTES = {
   HOME: '/',
   AUTH: {
      SIGNIN_NEXT: (path?: string) => `/auth/signin?next=${path?.trim()}`,
      SIGNUP_NEXT: (path?: string) => `/auth/signup?next=${path?.trim()}`,
      SIGNUP: `/auth/signup`,
      SIGNIN: '/auth/signin',
   },
   AUTHORS: (slug: string) => `/author/${slug}`,
   BOOKS: {
      NYT: (slug: string) => `/books/new-york-times/${slug}`,
      GOOGLE: (slug: string) => `/books/${slug}`,
   },
   CATEGORIES: (slug: string) => `/categories/${slug}`,
   PROFILE: {
      SETTINGS: (id: number | string) => `/profile/${id}/settings`,
   },
   SEARCH: (search: string, filters: FilterProps) => {
      return getSearchUrl(search, filters);
   },
};

const getSearchUrl = (search: string, filters: FilterProps) => {
   const { filterBy, filterParams } = filters;

   let url = `/search?q=${search}`;

   if (filterBy !== 'all') {
      url += `&filterBy=${encodeURIComponent(filterBy)}`;
   }

   if (filterParams && filterParams !== 'None') {
      url += `&view=${encodeURIComponent(filterParams)}`;
   }

   return url;
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

// the query cache that is dependent from the url params
export const decodeRoutes = {
   home: (category: string, meta?: MetaProps) => queryKeys.categories(category, meta),
   search: (search: string, filters: FilterProps) => queryKeys.bookSearch(search, filters),
   category: (category: string, meta?: MetaProps) => queryKeys.categories(category, meta),
};

export default ROUTES;
