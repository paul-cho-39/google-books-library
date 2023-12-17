import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import nytApi, {
   CategoryQualifiers,
   DateQualifiers,
   NytCategoryTypes,
   ReviewQualifiers,
} from '@/models/_api/fetchNytUrl';
import { fetcher, throttledFetcher } from '@/utils/fetchData';
import queryKeys from '@/utils/queryKeys';
import { BestSellerData, BookReview, Books, ReviewData } from '../types/nytBookTypes';
import {
   CategoriesNytQueries,
   CategoriesQueries,
   TestingCategoriesQueries,
} from '../types/serverTypes';
import { transformStrToArray } from '../helper/transformChar';
import { handleNytId } from '@/utils/handleIds';

interface NytBookQueryParams {
   date: DateQualifiers | 'current';
}

interface NytBookMultiQueries extends Partial<NytBookQueryParams> {
   initialData?: CategoriesNytQueries;
}

interface NytBookSingleQuery extends NytBookQueryParams {
   category: CategoryQualifiers;
   enabled: boolean;
   initialData?: ReviewData<BestSellerData>;
}

// if filtered then refetch the methods?
export default function useGetNytBestSeller({
   category = { type: 'fiction', format: 'combined-print-and-e-book' },
   date,
   enabled,
   initialData,
}: NytBookSingleQuery) {
   const queryClient = useQueryClient();
   const cache = queryClient.getQueryData(
      queryKeys.nytBestSellers(category.type, date as string)
   ) as ReviewData<BestSellerData>;

   const data = useQuery<ReviewData<BestSellerData>, unknown, BestSellerData>(
      queryKeys.nytBestSellers(category.type, category.format),
      async () => {
         const res = await throttledFetcher(nytApi.getUrlByCategory(category, date), {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
         });
         return res;
      },
      {
         select: (data) => data.results,
         enabled: enabled,
         initialData: cache ?? initialData,
         keepPreviousData: true,
      }
   );

   return data;
}

export function useGetNytBookReview(qualifiers: ReviewQualifiers, key: keyof ReviewQualifiers) {
   const value = qualifiers[key] as string;

   const data = useQuery<ReviewData<BookReview[]>, unknown, BookReview[]>(
      queryKeys.nytReview(key, value),
      async () => {
         const res = await fetcher(nytApi.getReviewUrl(qualifiers), {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
         });
         return res;
      },
      {
         select: (data) => data.results,
      }
   );

   if (data.isError) {
      throw new Error(`${data.failureReason}`);
   }

   return data;
}

export function useGetNytBestSellers({ initialData, date }: NytBookMultiQueries) {
   const queryClient = useQueryClient();
   const categories = ['fiction', 'nonfiction'] as unknown as NytCategoryTypes[];

   const checkInitialData = !initialData ? {} : initialData;

   const queries = categories.map((cat) => {
      const cache = queryClient.getQueryData(
         queryKeys.nytBestSellers(cat as CategoryQualifiers['type'], date as string)
      );
      return {
         queryKey: queryKeys.nytBestSellers(cat as CategoryQualifiers['type'], date as string),
         queryFn: async () => {
            const res = nytApi.getUrlByCategory(
               { type: cat, format: 'combined-print-and-e-book' },
               date
            );
            return await throttledFetcher(res);
         },
         initialData: cache || checkInitialData[cat],
         // suspense: true,
      };
   });

   const queriesData = useQueries({
      queries: [...queries],
   });

   const isNytDataSuccess = queriesData.every((queryData) => queryData.status === 'success');
   const isNytDataLoading = queriesData.some((queryData) => queryData.status === 'loading');

   const categoriesWithResults = queriesData.map((queryResult, index) => {
      const { data, ...rest } = queryResult;
      const sanitizedData = sanitizeData(data as ReviewData<BestSellerData>);
      return {
         category: categories[index],
         data: sanitizedData,
         isLoading: rest.isLoading,
         isError: rest.isError,
      };
   }) as TestingCategoriesQueries[];

   return { categoriesWithResults, isNytDataSuccess, isNytDataLoading };
}

/**
 * Transforms data so that it is compatible with Google books API data
 * @param data - The response data
 * @param numberOfBooks - The end number of items to slice
 */
function sanitizeData(data: ReviewData<BestSellerData>, numberOfBooks: number = 6) {
   return data?.results.books.slice(0, numberOfBooks).map((book) => {
      return {
         id: handleNytId.appendSuffix(book.primary_isbn13),
         volumeInfo: {
            authors: transformStrToArray(book?.author),
            title: book.title,
            description: book.description,
            publisher: book.publisher,
            imageLinks: {
               thumbnail: book.book_image,
               smallThumbnail: '',
            },
         },
         bestsellers_date: data.results.bestsellers_date,
         weeks_on_list: book.weeks_on_list,
         displayName: data.results.display_name,
      };
   });
}
