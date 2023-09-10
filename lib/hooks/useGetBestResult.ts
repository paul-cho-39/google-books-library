import { useQuery } from '@tanstack/react-query';
import nytApi, { CategoryQualifiers, DateQualifiers } from '../../models/_api/fetchNytUrl';
import { fetcher } from '../../utils/fetchData';
import queryKeys from '../queryKeys';
import { BestSellerData, Books } from '../types/nytBookTypes';

interface NytBookQueryParams {
   category: CategoryQualifiers;
   date: DateQualifiers | 'current';
}

// if filtered then refetch the methods?
export default function useGetNytBookQuery({
   category = { type: 'fiction', format: 'combined-print-and-e-book' },
   date,
}: NytBookQueryParams) {
   const data = useQuery<BestSellerData, unknown, Books[]>(
      queryKeys.nytBestSellers(category.type, category.format),
      async () => {
         const res = await fetcher(nytApi.getUrlByCategory(category, date), {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET',
         });
         return res;
      },
      {
         select: (data) => data.books,
         enabled: true, // loader here(?)
      }
   );

   if (data.isError) {
      throw new Error(`${data.failureReason}`);
   }

   return data;
}
