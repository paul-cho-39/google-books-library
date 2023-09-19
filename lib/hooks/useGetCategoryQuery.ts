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
}
interface MultipleQueries extends CategoryQueryParams<CategoriesQueries> {
   loadItems: number;
}

// also enable other book data as well here
// using useQuery to pair with different categories as well
// enable loader here(?) so whenever the data is loaded it will enable the data;
export default function useGetCategoryQuery({ initialData, category, enabled, meta }: SingleQuery) {
   const queryClient = new QueryClient();
   queryClient.prefetchQuery({
      queryKey: queryKeys.categories(category as string, meta),
      queryFn: () => fetcher(googleApi.getUrlBySubject(category, meta)),
   });
   const data = useQuery<Pages<any>, unknown, Items<any>[]>(
      queryKeys.categories(category as string, meta),
      () => {
         const url = fetcher(googleApi.getUrlBySubject(category, meta));
         return url;
      },
      {
         enabled: !!category && enabled,
         select: (data) => data.items,
         initialData: initialData,
      }
   );

   if (data.isError) {
      throw new Error(`${data.failureReason}`);
   }

   return data;
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
   const existingData = queryClient.getQueryData(
      queryKeys.allGoogleCategories
   ) as CategoriesQueries;

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
            // slicing should be later when the data is returned
            // so that the data is cached for a while
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

      acc[category.toLowerCase()] = queryData?.data;
      return acc;
   }, {} as { [key: TopCateogry]: unknown }) as CategoriesQueries;

   queryClient.setQueryData(queryKeys.allGoogleCategories, dataWithKeys);

   return { dataWithKeys, categoryData };
}

// pass loading status

// add an enabler here -- let's say something loaded then enable this to be loaded
// export function useGetCategoriesQueries(data: CategoriesQueries, meta?: MetaProps) {

//    const allCategories = [...serverSideCategories, ...topCategories];
//    const categoryKeys = allCategories.map((category, index) => {
//       return {
//          queryKey: queryKeys.categories(category, meta),
//          queryFn: async () => {
//             const url = googleApi.getUrlBySubject(category as Categories, {
//                maxResultNumber: meta?.maxResultNumber ?? 15,
//                pageIndex: meta?.maxResultNumber ?? 0,
//             });
//             const json = await fetcher(url);
//             const uniqueData = createUniqueData(json) as Items<any>[];
//             return uniqueData.slice(0, 6);
//          },
//          initialData: () => {
//             const serverCategory = serverSideCategories.includes(category) ? category : null;
//             if (serverCategory) {
//                return data[serverCategory.toLowerCase()];
//             }
//          },
//          // select: (data) => {
//          //    return allCategories.reduce((acc, category, index) => {
//          //       const queryData = categoryData[index];
//          //       acc[category.toLowerCase()] = queryData?.data;
//          //       return acc;
//          //    }, {} as { [key: TopCateogry]: unknown }) as CategoriesQueries;
//          // },
//          // enabled: !!data,
//       };
//    });

//    const categoryData = useQueries<unknown[]>({
//       queries: [...categoryKeys, {}],
//    });

//    // create a function for this
//    const dataWithKeys = allCategories.reduce((acc, category, index) => {
//       const queryData = categoryData[index];
//       if (queryData.isError) {
//          throw new Error(`${category} data failed to fetch.`);
//       }

//       acc[category.toLowerCase()] = queryData?.data;
//       return acc;
//    }, {} as { [key: TopCateogry]: unknown }) as CategoriesQueries;

//    return { dataWithKeys, categoryData };
// }

// this will return filter for couple things:
// 1) it will return category in a published date
// 2) return the most popular items(?)
// 3)
