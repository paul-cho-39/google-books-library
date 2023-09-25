import { InferGetServerSidePropsType } from 'next';
import { Categories, TopCateogry } from '../../constants/categories';
import { GoogleUpdatedFields, Items, Pages } from './googleBookTypes';
import { BestSellerData, ReviewData } from './nytBookTypes';
import { DefaultSession } from 'next-auth';

type CombinedData = {
   displayName?: string;
   weeks_on_list?: number;
   bestsellers_date?: string;
} & Items<any>;

// home/index.ts - front page
export type CategoriesDataParams = Record<string, Pages<any> | null>;
export type CategoryQuery = Record<string, GoogleUpdatedFields | null>;
export type CategoriesQueries = Record<string, CombinedData[] | null>;
export type CategoriesNytQueries = Record<string, ReviewData<BestSellerData>>;

export interface CustomSession extends DefaultSession {
   id: string | null | undefined;
}

export interface ReturnedCacheData<Data extends GoogleUpdatedFields | ReviewData<BestSellerData>> {
   cacheStatus: Record<string, string | number>;
   data: Data;
   lastUpdated: string;
   source: 'cache' | 'api';
}
