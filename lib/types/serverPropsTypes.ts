import { TopCateogry } from '../../constants/categories';
import { Items, Pages } from './googleBookTypes';
import { BestSellerData } from './nytBookTypes';

// home/index.ts - front page
export type CategoriesDataParams = Record<TopCateogry, Pages<any> | null>;
export type CategoriesQueries = Record<TopCateogry, Items<any>[] | null>;
export type CategoriesNytQueries = Record<string, BestSellerData>;
