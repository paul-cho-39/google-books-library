import { BookState, Rating } from '@prisma/client';
import { GoogleUpdatedFields, Items, Pages } from './googleBookTypes';
import { BestSellerData, ReviewData } from './nytBookTypes';
import { DefaultSession } from 'next-auth';

//
export type BasicServerProps = {
   userId: string | null;
   id: string;
};

export interface RatingData {
   userId: string;
   bookId: string;
   dateAdded: Date;
   ratingValue: number;
   dateUpdated: Date;
}

export type RateServerTypes = BasicServerProps & {
   placerData?: RatingData[] | null;
};

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

// change the name to serverTypes
export type ResponseRatingData = {
   success: boolean;
   data: RatingData[] | null;
   inLibrary: boolean;
};
