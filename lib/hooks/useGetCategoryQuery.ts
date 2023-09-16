import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query';
import {
   Categories,
   TopCateogry,
   serverSideCategories,
   topCategories,
} from '../../constants/categories';
import queryKeys from '../queryKeys';
import googleApi, { MetaProps } from '../../models/_api/fetchGoogleUrl';
import { Pages, Items } from '../types/googleBookTypes';
import { createUniqueData } from '../helper/books/filterUniqueData';
import { fetcher } from '../../utils/fetchData';
import { CategoriesQueries } from '../types/serverPropsTypes';

interface CategoryQueryParams {
   initialData: Pages<any>;
   category: Categories;
   sort: string;
   meta?: MetaProps;
}

// also enable other book data as well here
// using useQuery to pair with different categories as well
// enable loader here(?) so whenever the data is loaded it will enable the data;
export default function useGetCategoryQuery(
   initialData: Pages<any>,
   category: Categories,
   meta?: MetaProps
) {
   const data = useQuery<Pages<any>, unknown, Items<any>[]>(
      queryKeys.categories(category as string, meta),
      () => {
         const url = fetcher(googleApi.getUrlBySubject(category, meta));
         return url;
      },
      {
         enabled: !!category,
         select: (data) => data.items,
         initialData: initialData,
      }
   );

   if (data.isError) {
      throw new Error(`${data.failureReason}`);
   }

   return data;
}

// add an enabler here -- let's say something loaded then enable this to be loaded
export function useGetCategoriesQueries(data: CategoriesQueries, meta?: MetaProps) {
   const allCategories = [...serverSideCategories, ...topCategories];
   const categoryKeys = allCategories.map((category, index) => {
      return {
         queryKey: queryKeys.categories(category, meta),
         queryFn: async () => {
            const url = googleApi.getUrlBySubject(category as Categories, {
               maxResultNumber: meta?.maxResultNumber ?? 15,
               pageIndex: meta?.maxResultNumber ?? 0,
            });
            const json = await fetcher(url);
            const uniqueData = createUniqueData(json) as Items<any>[];
            return uniqueData.slice(0, 6);
         },
         initialData: () => {
            const serverCategory = serverSideCategories.includes(category) ? category : null;
            if (serverCategory) {
               return data[serverCategory.toLowerCase()];
            }
         },
         // select: (data) => {
         //    return allCategories.reduce((acc, category, index) => {
         //       const queryData = categoryData[index];
         //       acc[category.toLowerCase()] = queryData?.data;
         //       return acc;
         //    }, {} as { [key: TopCateogry]: unknown }) as CategoriesQueries;
         // },
         // enabled: !!data,
      };
   });

   const categoryData = useQueries<unknown[]>({
      queries: [...categoryKeys, {}],
   });

   // create a function for this
   const dataWithKeys = allCategories.reduce((acc, category, index) => {
      const queryData = categoryData[index];
      if (queryData.isError) {
         throw new Error(`${category} data failed to fetch.`);
      }

      acc[category.toLowerCase()] = queryData?.data;
      return acc;
   }, {} as { [key: TopCateogry]: unknown }) as CategoriesQueries;

   return { dataWithKeys, categoryData };
}

// this will return filter for couple things:
// 1) it will return category in a published date
// 2) return the most popular items(?)
// 3)
