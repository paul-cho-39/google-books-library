import { InferGetServerSidePropsType } from 'next';
import { TopCateogry } from '../../constants/categories';
import { Items, Pages } from './googleBookTypes';
import { BestSellerData } from './nytBookTypes';
import { getServerSideProps } from '../../pages';
import { DefaultSession } from 'next-auth';

type CombinedData = {
   displayName?: string;
   weeks_on_list?: number;
   bestsellers_date?: string;
} & Items<any>;

// home/index.ts - front page
export type CategoriesDataParams = Record<TopCateogry, Pages<any> | null>;
export type CategoriesQueries = Record<TopCateogry, CombinedData[] | null>;
export type CategoriesNytQueries = Record<string, BestSellerData>;

export interface CustomSession extends DefaultSession {
   id: string | null | undefined;
}

export type InferServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;
