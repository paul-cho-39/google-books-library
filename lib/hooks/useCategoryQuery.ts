import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query';
import { Categories, TopCateogry, topCategories } from '../../constants/categories';
import queryKeys from '../queryKeys';
import googleApi, { MetaProps, fetcher } from '../helper/books/fetchGoogleUrl';
import { Pages, Items } from '../types/googleBookTypes';
import { CategoriesDataParams } from '../../pages';

type CategoriesQueries = Record<TopCateogry, Items<any>>;
export default function useCategoryQuery(category: Categories, meta?: MetaProps) {
   // this is a test -- should be using useQueries
   const data = useQuery<Pages<any>, unknown, Items<any>[]>(
      queryKeys.categories(category as string),
      () => {
         const url = googleApi.getUrlBySubject(category);
         if (meta) {
            return fetcher(googleApi.addMeta(url, meta));
         } else {
            return fetcher(url);
         }
      },
      // TODO: may have to play around with properties
      {
         enabled: !!category,
         select: (data) => data.items,
      }
   );

   if (data.isError) {
      throw new Error(`${data.failureReason}`);
   }

   return data;
}

// add an enabler here -- let's say something loaded then enable this to be loaded
export function useCategoriesQueries(data: CategoriesDataParams) {
   const categoryKeys = topCategories.map((category, index) => {
      return {
         queryKey: queryKeys.categories(category),
         initialData: data[category.toLowerCase()],
         select: (data: Pages<any>) => data.items,
      };
   });

   const categoryData = useQueries<unknown[]>({
      queries: [...categoryKeys, {}],
   });

   const dataWithKeys = topCategories.reduce((acc, category, index) => {
      acc[category.toLowerCase()] = categoryData[index]?.data;
      return acc;
   }, {} as { [key: TopCateogry]: unknown });

   return { dataWithKeys, categoryData };
}
