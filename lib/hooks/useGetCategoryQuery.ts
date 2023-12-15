import {
   QueryClient,
   UseQueryResult,
   useQueries,
   useQuery,
   useQueryClient,
} from '@tanstack/react-query';
import {
   Categories,
   TopCateogry,
   serverSideCategories,
   topCategories,
   NUM_CATEGORIES_LOAD,
} from '@/constants/categories';
import queryKeys from '@/utils/queryKeys';
import googleApi, { MetaProps } from '@/models/_api/fetchGoogleUrl';
import { Pages, Items, GoogleUpdatedFields } from '../types/googleBookTypes';
import { createUniqueData } from '../helper/books/filterUniqueData';
import { fetcher, throttledFetcher } from '@/utils/fetchData';
import { CategoriesQueries, CategoryQuery } from '../types/serverTypes';
import { useEffect, useMemo, useRef, useState } from 'react';

interface CategoryQueryParams<TData extends CategoriesQueries | GoogleUpdatedFields> {
   initialData?: TData;
   enabled?: boolean;
   meta?: MetaProps;
}

interface SingleQuery extends CategoryQueryParams<GoogleUpdatedFields> {
   category: Categories;
   keepPreviousData?: boolean;
}

interface MultipleQueries extends CategoryQueryParams<CategoriesQueries> {
   loadItems: number;
   returnNumberOfItems?: number;
}

/**
 * A hook for fetching and managing for a specific category of data
 * @param {Object} SingleQuery {initialData, category, enabled, meta, keepPreviousData}
 * @returns
 */
export default function useGetCategoryQuery({
   initialData,
   category,
   enabled,
   meta,
   keepPreviousData,
}: SingleQuery) {
   const queryClient = new QueryClient();

   const lowercaseCategory = (category as string)?.toLocaleLowerCase();
   const cache = queryClient.getQueryData(
      queryKeys.categories(lowercaseCategory, meta)
   ) as GoogleUpdatedFields;

   const data = useQuery<GoogleUpdatedFields, unknown, GoogleUpdatedFields>(
      queryKeys.categories(lowercaseCategory, meta),
      async () => {
         const url = googleApi.getUrlBySubject(lowercaseCategory, meta);
         const data = await throttledFetcher(url);
         return data;
      },
      {
         enabled: !!category && enabled,
         select: (data) => data,
         initialData: cache ?? initialData,
         keepPreviousData: keepPreviousData,
         cacheTime: Infinity,
      }
   );

   if (data.isError) {
      throw new Error(`${data.failureReason}`);
   }

   // google books return duplicated items
   // this function returns cleaned data
   const cleanedData = createUniqueData(data?.data?.items);

   return {
      cleanedData,
      data,
   };
}

/**
 * Fetches batch categories and manages cache. The default caching time is Infinity.
 * @param {Object} MultipleQueries {initialData, loadItems, enabled, meta, returnNumberOfItems = 6 }
 * @returns
 */
export function useGetCategoriesQueries({
   initialData,
   loadItems,
   enabled,
   meta,
   returnNumberOfItems = 6,
}: MultipleQueries) {
   const allCategories = [...serverSideCategories, ...topCategories];

   // updates the index to slice when 'Load More' button is pressed
   const nextIndex = loadItems + NUM_CATEGORIES_LOAD;
   const indexTo = nextIndex >= allCategories.length ? allCategories.length : nextIndex;
   const updatedCategories = useMemo(() => allCategories.slice(loadItems, indexTo), [loadItems]);

   // the cache here is the data that is being passed.
   // When user comes back to home page and all data is cached inside and do not require re-fetching data.
   const queryClient = useQueryClient();
   const cache = queryClient.getQueryData<CategoriesQueries>(queryKeys.allGoogleCategories);

   const categoryKeys = updatedCategories.map((category, index) => {
      const lowercaseCategory = category.toLocaleLowerCase();
      return {
         queryKey: queryKeys.categories(lowercaseCategory, meta),
         queryFn: async () => {
            const url = googleApi.getUrlBySubject(lowercaseCategory, meta);
            const data = await fetcher(url);
            return data;
         },
         // if initial data is already been cached
         initialData: () => {
            if (initialData) {
               return initialData[lowercaseCategory];
            }
         },
         // select: (data: GoogleUpdatedFields) => data.items,
         enabled: enabled,
         keepPreviousData: true,
         cacheTime: Infinity,
      };
   });

   const queriesData = useQueries<(typeof categoryKeys)[]>({
      queries: categoryKeys,
   });

   const isGoogleDataSuccess = queriesData.every((queryData) => queryData.status === 'success');
   const isGoogleDataLoading = queriesData.some((queryData) => queryData.status === 'loading');

   let dataWithKeys;
   if (isGoogleDataSuccess) {
      dataWithKeys = updatedCategories.reduce((acc, category, index) => {
         const queryData = queriesData[index];

         // DEBUGGING
         if (queryData.isError) {
            throw new Error(`${category} data failed to fetch.`);
         }

         const data = queryData.data as GoogleUpdatedFields;
         const itemsToSlice = Math.min(returnNumberOfItems, meta?.maxResultNumber ?? 15);
         const cleanedData = createUniqueData(data.items)?.slice(0, itemsToSlice);

         acc[category.toLowerCase()] = cleanedData;

         return acc;
      }, {} as { [key: TopCateogry]: unknown }) as CategoriesQueries;
   }

   // set up new cache if theres no cache
   if (!cache || isGoogleDataSuccess) {
      queryClient.setQueryData(queryKeys.allGoogleCategories, {
         ...cache,
         ...dataWithKeys,
      });
   }

   return {
      dataWithKeys,
      cache,
      isGoogleDataSuccess,
      isGoogleDataLoading,
      queriesData,
   };
}
