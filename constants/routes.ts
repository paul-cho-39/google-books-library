import queryKeys from '../lib/queryKeys';
import { MetaProps } from '../models/_api/fetchGoogleUrl';

// TODO: move this file to /api/routes
const routes = {
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

// TEST WHETHER REACT-QUERY WILL QUERY THE SEARCH
export const decodeRoutes = {
   home: (category: string, meta?: MetaProps) => queryKeys.categories(category, meta),
   search: (search: string) => queryKeys.bookSearch(search),
   category: (category: string, meta?: MetaProps) => queryKeys.categories(category, meta),
};

export default routes;

export type RouteNames = 'home' | 'search' | 'category';

type ReturnedRoutes = ReturnType<(typeof routes)[keyof typeof routes]>;
export type RouteParams = ReturnedRoutes & {
   slug?: string;
};

export type CategoryRouteParams = RouteParams & {
   maxResultNumber: number;
   pageIndex: number;
   byNewest: string | undefined;
};

export type CheckCategoryRouteParams<T> = T extends {
   maxResultNumber: number;
   pageIndex: number;
   byNewest?: boolean;
}
   ? CategoryRouteParams
   : RouteParams;
