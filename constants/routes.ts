import queryKeys from '../lib/queryKeys';
import { MetaProps } from '../models/_api/fetchGoogleUrl';
import { getRouteParams } from '../utils/transformChar';

// TODO: move this file to /api/routes
const routes = {
   home: (category: string) => getRouteParams('home', category),
   search: (search: string) => getRouteParams('search', search),
   category: (category: string) => getRouteParams('category', category),
} as const;

// TEST WHETHER REACT-QUERY WILL QUERY THE SEARCH
export const decodeRoutes = {
   home: (category: string, meta?: MetaProps) => queryKeys.categories(category, meta),
   search: (search: string) => queryKeys.bookSearch(search),
   category: (category: string, meta?: MetaProps) => queryKeys.categories(category, meta),
};

export default routes;

export type RouteParams = (typeof routes)[keyof typeof routes];
