import { useQuery } from '@tanstack/react-query';
import { Categories } from '../../constants/categories';
import queryKeys from '../queryKeys';
import googleApi, { MetaProps, fetcher } from '../helper/books/fetchGoogleUrl';
import { Pages, Items } from '../types/googleBookTypes';

// will be using useQueries to fetch multiple categories at once
// change the name where and more params will be added
// plus make it a bit more abstract

export default function useCategoryQuery(category: Categories, meta?: MetaProps) {
   // this is a test -- should be using useQueries
   const data = useQuery<Pages<any>, unknown, Items<any>[]>(
      queryKeys.categories(category as string),
      () => {
         const url = googleApi.getUrlBySubject(category);
         if (meta) {
            return fetcher(googleApi.addMeta(url, meta));
         } else {
            return fetcher(url);
         }
      },
      // TODO: may have to play around with some of these numbers;
      {
         enabled: !!category,
         select: (data) => data.items,
      }
   );

   if (data.isError) {
      throw new Error(`${data.failureReason}`);
   }

   return data;
}
