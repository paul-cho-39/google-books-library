import { useQuery } from '@tanstack/react-query';
import { Categories } from '../../constants/categories';
import queryKeys from '../queryKeys';
import googleApi, { MetaProps, fetcher } from '../helper/books/fetchGoogleUrl';

export default function useCategoryQuery(category: Categories, meta?: MetaProps) {
   // this is a test -- should be using useQueries
   const { data, status } = useQuery(
      // queryKeys.categories(category as string),
      ['category'],
      () => {
         const url = googleApi.getUrlBySubject(category);
         if (meta) {
            return fetcher(googleApi.addMeta(url, meta));
         } else {
            return fetcher(url);
         }
      }
      // {
      //    enabled: !!category,
      // }
   );

   return { data, status };
}
