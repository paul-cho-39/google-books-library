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
import {
   CategoriesQueries,
   CategoryQuery,
   CombinedData,
   TestingCategoriesQueries,
} from '../types/serverTypes';
import { useEffect, useMemo, useRef, useState } from 'react';
import API_ROUTES from '@/utils/apiRoutes';

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
         // const url = googleApi.getUrlBySubject(lowercaseCategory, meta);
         // const data = await throttledFetcher(url);
         // return data;
         const res = await fetcher(
            API_ROUTES.THIRD_PARTY.path({
               source: 'google',
               endpoint: 'recent',
               category: lowercaseCategory,
            }),
            {
               method: 'POST',
               body: JSON.stringify(meta),
            }
         );

         return res.data;
      },
      {
         enabled: !!category && enabled,
         select: (data) => data,
         initialData: cache ?? initialData,
         keepPreviousData: keepPreviousData,
         cacheTime: Infinity, // should be kept at infinity?
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
   const cache = queryClient.getQueryData<TestingCategoriesQueries[]>(
      queryKeys.allGoogleCategories
   );

   const categoryKeys = updatedCategories.map((category, index) => {
      const lowercaseCategory = category.toLocaleLowerCase();
      return {
         queryKey: queryKeys.categories(lowercaseCategory, meta),
         queryFn: async () => {
            // const url = googleApi.getUrlBySubject(lowercaseCategory, meta);
            // const data = await fetcher(url);
            // return data;
            const res = await fetcher(
               API_ROUTES.THIRD_PARTY.path({
                  source: 'google',
                  endpoint: 'relevant',
                  category: lowercaseCategory,
               }),
               {
                  method: 'POST',
                  body: JSON.stringify(meta),
               }
            );

            return res.data;
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

   const categoriesWithResults = queriesData.map((queryResult, index) => {
      const { data, ...rest } = queryResult;
      const googleData = data as GoogleUpdatedFields;
      const itemsToSlice = Math.min(returnNumberOfItems, meta?.maxResultNumber || 15);
      const cleanedData = createUniqueData(googleData.items)?.slice(0, itemsToSlice);
      return {
         category: updatedCategories[index],
         data: cleanedData,
         isLoading: rest.isLoading,
         isError: rest.isError,
      };
   }) as TestingCategoriesQueries[];

   // set up new cache if theres no cache
   if (!cache || isGoogleDataSuccess) {
      const mergedData = mergeDataWithoutDuplicates(cache, categoriesWithResults, 6);
      queryClient.setQueryData<TestingCategoriesQueries[]>(
         queryKeys.allGoogleCategories,
         mergedData
      );
   }

   return {
      cache,
      isGoogleDataSuccess,
      isGoogleDataLoading,
      categoriesWithResults,
   };
}

/**
 * Helper function for setting new incoming data. It removes any duplicates from the current cache.
 * @param cache
 * @param newData
 * @param itemsToSlice
 * @returns
 */
function mergeDataWithoutDuplicates(
   cache: TestingCategoriesQueries[] | undefined,
   newData: TestingCategoriesQueries[],
   itemsToSlice: number
): TestingCategoriesQueries[] {
   if (!cache) return newData;

   const existingCategories = new Map<string, TestingCategoriesQueries>(
      cache?.map((item) => [item.category, item])
   );

   newData.forEach((newItem) => {
      const existingCat = existingCategories.get(newItem.category);

      if (existingCat) {
         // mrege new items with existing items, avoiding duplicates
         const mergedItems = [
            ...(existingCat.data as CombinedData[]),
            ...(newItem.data as CombinedData[]),
         ];
         const uniqueItemIds = new Set(mergedItems.map((item) => item.id));
         const uniqueItems = Array.from(uniqueItemIds)
            .map((id) => mergedItems.find((item) => item.id === id)!)
            .slice(0, itemsToSlice);

         existingCategories.set(newItem.category, { ...existingCat, data: uniqueItems });
      } else {
         // if category is new then add it
         const slicedData = newItem?.data?.slice(0, itemsToSlice);
         existingCategories.set(newItem.category, { ...newItem, data: slicedData });
      }
   });

   return Array.from(existingCategories.values());
}
