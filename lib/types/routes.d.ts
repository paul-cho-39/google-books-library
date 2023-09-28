import { encodeRoutes } from '../utils/routes';

export type RouteNames = 'home' | 'search' | 'category';

type ReturnedRoutes = ReturnType<(typeof encodeRoutes)[keyof typeof encodeRoutes]>;
export type RouteParams = Partial<ReturnedRoutes> & {
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
