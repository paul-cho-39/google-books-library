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
import { useState } from 'react';

interface CategoryQueryParams<TData extends CategoriesQueries | GoogleUpdatedFields> {
   initialData?: TData;
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
   // const [cleanedData, setCleanedData] = useState<Items<any>[] | null>(null);

   const cache = queryClient.getQueryData(
      queryKeys.categories(category as string, meta)
   ) as GoogleUpdatedFields;

   const data = useQuery<GoogleUpdatedFields, unknown, GoogleUpdatedFields>(
      queryKeys.categories(category as string, meta),
      async () => {
         const res = await fetchDataFromCache<GoogleUpdatedFields>(category, route);
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

   // if (data && data.data.items) {
   //    const sanitized = createUniqueData(data.data.items);
   //    setCleanedData(sanitized);
   // }

   const cleanedData = createUniqueData(data?.data?.items);

   return {
      cleanedData,
      data,
   };
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

            return res.data.items;
         },
         initialData: () => {
            const serverCategory = serverSideCategories.includes(category) ? category : null;
            if (initialData && serverCategory) {
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

      // DEBUGGING
      if (queryData.isError) {
         throw new Error(`${category} data failed to fetch.`);
      }

      const data = queryData.data as Items<any>[];

      const sanitized = createUniqueData(data);
      acc[category.toLowerCase()] = sanitized?.slice(0, 6);

      return acc;
   }, {} as { [key: TopCateogry]: unknown }) as CategoriesQueries;

   queryClient.setQueryData(queryKeys.allGoogleCategories, dataWithKeys);

   return { dataWithKeys, categoryData };
}
