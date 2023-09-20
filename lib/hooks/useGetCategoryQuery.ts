import { QueryClient, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
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

interface CategoryQueryParams<TData extends CategoriesQueries | Pages<any>> {
   initialData: TData;
   enabled?: boolean;
   meta?: MetaProps;
}

interface SingleQuery extends CategoryQueryParams<Pages<any>> {
   category: Categories;
   keepPreviousData?: boolean;
}
interface MultipleQueries extends CategoryQueryParams<CategoriesQueries> {
   loadItems: number;
}

export default function useGetCategoryQuery({
   initialData,
   category,
   enabled,
   meta,
   keepPreviousData,
}: SingleQuery) {
   const queryClient = new QueryClient();

   const cache = queryClient.getQueryData(
      queryKeys.categories(category as string, meta)
   ) as Pages<any>;

   const data = useQuery<Pages<any>, unknown, Pages<any>>(
      queryKeys.categories(category as string, meta),
      () => {
         const url = fetcher(googleApi.getUrlBySubject(category, meta));
         return url;
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

   const categoryKeys = updatedCategories.map((category, index) => {
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
               return initialData[serverCategory.toLowerCase()];
            }
         },
         enabled: enabled,
         suspense: true,
      };
   });

   const categoryData = useQueries<unknown[]>({
      queries: [...categoryKeys, {}],
   });

   const dataWithKeys = updatedCategories.reduce((acc, category, index) => {
      const queryData = categoryData[index];
      if (queryData.isError) {
         throw new Error(`${category} data failed to fetch.`);
      }

      const data = queryData.data as Items<any>[];
      acc[category.toLowerCase()] = data;
      // acc[category.toLowerCase()] = data.slice(0, 6);

      return acc;
   }, {} as { [key: TopCateogry]: unknown }) as CategoriesQueries;

   queryClient.setQueryData(queryKeys.allGoogleCategories, dataWithKeys);

   return { dataWithKeys, categoryData };
}
