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
import { CategoriesQueries, CategoryQuery } from '../types/serverPropsTypes';

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
   returnNumberOfItems?: number;
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

   const lowercaseCategory = (category as string).toLocaleLowerCase();
   const cache = queryClient.getQueryData(
      queryKeys.categories(lowercaseCategory, meta)
   ) as GoogleUpdatedFields;

   const data = useQuery<GoogleUpdatedFields, unknown, GoogleUpdatedFields>(
      queryKeys.categories(lowercaseCategory, meta),
      async () => {
         const url = googleApi.getUrlBySubject(lowercaseCategory, meta);
         const data = await fetcher(url);
         return data;
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

   const cleanedData = createUniqueData(data?.data?.items);

   return {
      cleanedData,
      data,
   };
}

// change the cache here
const LOAD_ITEMS = 4;
export function useGetCategoriesQueries({
   initialData,
   loadItems,
   enabled,
   meta,
   returnNumberOfItems = 6,
}: MultipleQueries) {
   const allCategories = [...serverSideCategories, ...topCategories];

   const itemsToSlice = Math.min(returnNumberOfItems, meta?.maxResultNumber ?? 15);
   const updatedCategories = allCategories.slice(0, loadItems + LOAD_ITEMS);

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
         initialData: () => {
            if (initialData) {
               return initialData[lowercaseCategory];
            }
         },
         // select: (data: GoogleUpdatedFields) => data.items,
         enabled: enabled,
      };
   });

   const queriesData = useQueries<unknown[]>({
      queries: categoryKeys,
   });

   const dataIsSuccess = queriesData.every((queryData) => queryData.status === 'success');

   const dataWithKeys = updatedCategories.reduce((acc, category, index) => {
      const queryData = queriesData[index];

      // DEBUGGING
      if (queryData.isError) {
         throw new Error(`${category} data failed to fetch.`);
      }

      const data = queryData.data as Items<any>[];
      const cleanedData = createUniqueData(data)?.slice(0, itemsToSlice);

      acc[category.toLowerCase()] = cleanedData;

      return acc;
   }, {} as { [key: TopCateogry]: unknown }) as CategoriesQueries;

   if (!cache) {
      queryClient.setQueryData(queryKeys.allGoogleCategories, dataWithKeys);
   }

   return {
      dataWithKeys,
      // transformedData,
      queriesData,
      dataIsSuccess,
   };
}
