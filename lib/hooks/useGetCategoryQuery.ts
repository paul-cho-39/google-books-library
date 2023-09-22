import { QueryClient, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   Categories,
   TopCateogry,
   serverSideCategories,
   topCategories,
} from '../../constants/categories';
import queryKeys from '../queryKeys';
import googleApi, { MetaProps } from '../../models/_api/fetchGoogleUrl';
import { Pages, Items, GoogleUpdatedFields } from '../types/googleBookTypes';
import { createUniqueData } from '../helper/books/filterUniqueData';
import { FetchCacheType, fetchDataFromCache, fetcher } from '../../utils/fetchData';
import { CategoriesQueries } from '../types/serverPropsTypes';

interface CategoryQueryParams<TData extends CategoriesQueries | GoogleUpdatedFields> {
   initialData: TData;
   enabled?: boolean;
   meta?: MetaProps;
}

interface SingleQuery extends CategoryQueryParams<GoogleUpdatedFields> {
   category: Categories;
   route: FetchCacheType;
   keepPreviousData?: boolean;
}

interface MultipleQueries extends CategoryQueryParams<CategoriesQueries> {
   loadItems: number;
}

export default function useGetCategoryQuery({
   initialData,
   category,
   route,
   enabled,
   meta,
   keepPreviousData,
}: SingleQuery) {
   const queryClient = new QueryClient();

   const cache = queryClient.getQueryData(
      queryKeys.categories(category as string, meta)
   ) as GoogleUpdatedFields;

   const data = useQuery<GoogleUpdatedFields, unknown, GoogleUpdatedFields>(
      queryKeys.categories(category as string, meta),
      async () => {
         const res = await fetchDataFromCache<GoogleUpdatedFields>(category, route, meta);
         return res.data;
      },
      {
         enabled: !!category && enabled,
         select: (data) => data,
         initialData: cache ?? initialData,
         keepPreviousData: keepPreviousData,
      }
   );

   if (data.isError) {
      throw new Error(`${data.failureReason}`);
   }

   const cleanedData = createUniqueData(data.data.items);

   return { cleanedData, data };
}

// what happens when the page is refreshed?
// if the page is refreshed the data has to be fetched again?
// does this call for zustand(?) so that it stores the info
// inside the cache?
const LOAD_ITEMS = 4;
export function useGetCategoriesQueries({
   initialData,
   loadItems,
   enabled,
   meta,
}: MultipleQueries) {
   const allCategories = [...serverSideCategories, ...topCategories];

   const updatedCategories = allCategories.slice(0, loadItems + LOAD_ITEMS);

   const queryClient = useQueryClient();
   const cache = queryClient.getQueryData<CategoriesQueries>(queryKeys.allGoogleCategories);

   const categoryKeys = updatedCategories.map((category, index) => {
      return {
         queryKey: queryKeys.categories(category, meta),
         queryFn: async () => {
            const res = await fetchDataFromCache<GoogleUpdatedFields>(category, {
               source: 'google',
               endpoint: 'relevant',
            });
            const uniqueData = createUniqueData(res.data.items);
            return uniqueData;
         },
         initialData: () => {
            const serverCategory = serverSideCategories.includes(category) ? category : null;
            if (serverCategory) {
               return initialData[serverCategory.toLowerCase()];
            }
         },
         enabled: enabled,
      };
   });

   const categoryData = useQueries<unknown[]>({
      queries: [...categoryKeys, {}],
   });

   const dataWithKeys = updatedCategories.reduce((acc, category, index) => {
      const queryData = categoryData[index];
      // if (queryData.isError) {
      //    throw new Error(`${category} data failed to fetch.`);
      // }

      const data = queryData.data as Items<any>[];
      // acc[category.toLowerCase()] = data;
      acc[category.toLowerCase()] = data?.slice(0, 6);

      return acc;
   }, {} as { [key: TopCateogry]: unknown }) as CategoriesQueries;

   queryClient.setQueryData(queryKeys.allGoogleCategories, dataWithKeys);

   return { dataWithKeys, categoryData };
}
