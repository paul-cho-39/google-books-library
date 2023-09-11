import { useQueries, useQuery } from '@tanstack/react-query';
import nytApi, {
   CategoryQualifiers,
   DateQualifiers,
   ReviewQualifiers,
} from '../../models/_api/fetchNytUrl';
import { fetcher } from '../../utils/fetchData';
import queryKeys from '../queryKeys';
import { BestSellerData, BookReview, Books, ReviewData } from '../types/nytBookTypes';
import { CategoriesNytQueries } from '../types/serverPropsTypes';

interface NytBookQueryParams {
   category: CategoryQualifiers;
   date: DateQualifiers | 'current';
   initialData?: ReviewData<BestSellerData>;
}

// if filtered then refetch the methods?
export default function useGetNytBestSeller({
   category = { type: 'fiction', format: 'combined-print-and-e-book' },
   date,
   initialData,
}: NytBookQueryParams) {
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
         enabled: true, // loader here(?),
         initialData: initialData,
      }
   );

   if (data.isError) {
      throw new Error(`${data.failureReason}`);
   }

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

export function useGetNytBestSellers(initialData: CategoriesNytQueries, date: string) {
   const queries = ['fiction', 'nonfiction'].map((key) => {
      return {
         queryKey: queryKeys.nytBestSellers(key as CategoryQualifiers['type'], date),
         initialData: initialData[key],
      };
   });

   const data = useQueries({
      queries: [...queries],
   });

   return data;
}
