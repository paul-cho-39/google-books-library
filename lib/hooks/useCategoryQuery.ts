import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query';
import { Categories, TopCateogry, topCategories } from '../../constants/categories';
import queryKeys from '../queryKeys';
import googleApi, { MetaProps, fetcher } from '../../models/_api/fetchGoogleUrl';
import { Pages, Items } from '../types/googleBookTypes';
import { CategoriesDataParams, CategoriesQueries } from '../../pages';
import { createUniqueData } from '../helper/books/filterUniqueData';

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
export function useCategoriesQueries(data: CategoriesQueries) {
   const categoryKeys = topCategories.map((category, index) => {
      return {
         queryKey: queryKeys.categories(category),
         queryFn: async () => {
            if (!data) {
               const url = googleApi.getUrlBySubject(category as Categories, {
                  maxResultNumber: 6,
                  pageIndex: 0,
               });
               const json = await fetcher(url);
               const uniqueData = createUniqueData(json) as Items<any>[];
               return uniqueData?.slice(0, 6);
            }
         },
         initialData: data[category.toLowerCase()],
      };
   });

   const categoryData = useQueries<unknown[]>({
      queries: [...categoryKeys, {}],
   });

   const dataWithKeys = topCategories.reduce((acc, category, index) => {
      const queryData = categoryData[index];
      if (queryData.isError) {
         throw new Error(`${category} data failed to fetch.`);
      }

      acc[category.toLowerCase()] = queryData?.data;
      return acc;
   }, {} as { [key: TopCateogry]: unknown }) as CategoriesQueries;

   return { dataWithKeys, categoryData };
}
