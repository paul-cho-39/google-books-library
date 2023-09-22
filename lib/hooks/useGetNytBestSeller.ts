import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import nytApi, {
   CategoryQualifiers,
   DateQualifiers,
   ReviewQualifiers,
} from '../../models/_api/fetchNytUrl';
import { fetcher } from '../../utils/fetchData';
import queryKeys from '../queryKeys';
import { BestSellerData, BookReview, Books, ReviewData } from '../types/nytBookTypes';
import { CategoriesNytQueries, CategoriesQueries } from '../types/serverPropsTypes';
import { transformStrToArray } from '../../utils/transformChar';
import { handleNytId } from '../../utils/handleIds';

interface NytBookQueryParams {
   category: CategoryQualifiers;
   date: DateQualifiers | 'current';
}

interface NytBookMultiQueries extends Partial<NytBookQueryParams> {
   initialData: CategoriesNytQueries;
}

interface NytBookSingleQuery extends NytBookQueryParams {
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
      queryKeys.nytBestSellers(category.type, category.format)
   ) as ReviewData<BestSellerData>;
   // console.log('the cache here is : ', cache);

   const data = useQuery<ReviewData<BestSellerData>, unknown, BestSellerData>(
      queryKeys.nytBestSellers(category.type, category.format),
      () => {
         const res = fetcher(nytApi.getUrlByCategory(category, date), {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
         });
         return res;
      },
      {
         select: (data) => data.results,
         enabled: enabled,
         initialData: cache ?? initialData,
      }
   );

   return data;
}

export function useGetNytBookReview(qualifiers: ReviewQualifiers, key: keyof ReviewQualifiers) {
   const value = qualifiers[key] as string;
   const data = useQuery<ReviewData<BookReview[]>, unknown, BookReview[]>(
      queryKeys.nytReview(key, value),
      () => {
         const res = fetcher(nytApi.getReviewUrl(qualifiers), {
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

export function useGetNytBestSellers({ initialData, category, date }: NytBookMultiQueries) {
   const type = ['fiction', 'nonfiction'];

   const queries = type.map((key) => {
      return {
         queryKey: queryKeys.nytBestSellers(key as CategoryQualifiers['type'], date as string),
         queryFn: () => {
            const res = nytApi.getUrlByCategory(category, date);
            return res;
         },
         initialData: initialData[key],
         // suspense: true,
      };
   });

   const queryData = useQueries({
      queries: [...queries],
   });

   // transform data
   const dataWithKeys = type.reduce((acc, cat, index) => {
      const data = queryData[index];
      if (data.isError) {
         throw new Error(`${category} data failed to fetch.`);
      }

      acc[cat] = data?.data as BestSellerData;
      return acc;
   }, {} as { [key: string]: unknown } as CategoriesNytQueries);

   const transformedData = transformData(dataWithKeys);

   return { queryData, transformedData };
}

function transformData<T extends CategoriesNytQueries>(data: T) {
   const adapted: CategoriesQueries = {};
   for (const [key, value] of Object.entries(data)) {
      adapted[key] = value.books.map((book) => ({
         id: handleNytId.appendSuffix(book.primary_isbn13),
         volumeInfo: {
            authors: transformStrToArray(book.author),
            title: book.title,
            description: book.description,
            publisher: book.publisher,
            imageLinks: {
               thumbnail: book.book_image,
               smallThumbnail: '',
            },
         },
         bestsellers_date: value.bestsellers_date,
         weeks_on_list: book.weeks_on_list,
         displayName: value.display_name,
      }));
   }
   return adapted;
}
