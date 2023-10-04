import { useQuery, useQueryClient } from '@tanstack/react-query';
import queryKeys from '../../utils/queryKeys';
import { CategoriesQueries, SingleRateData } from '../types/serverPropsTypes';
import apiRequest from '../../utils/fetchData';
import API_ROUTES from '../../utils/apiRoutes';

// returning batch rating of book from /categories and '/'
export default function useGetRatings(data: CategoriesQueries, isSuccess: boolean) {
   const queryClient = useQueryClient();

   const initialData = queryClient.getQueryData<CategoriesQueries>(queryKeys.allGoogleCategories);
   const bookIds = extractIdsToArray(data as CategoriesQueries, initialData);

   // debugging
   console.log('-------------------------');
   console.log('the INITIAL DATA IS : ', initialData);
   console.log('-------------------------');
   // debugging
   console.log('-------------------------');
   console.log('the book ids are : ', bookIds);
   console.log('-------------------------');

   // require dynamic?
   return useQuery(
      queryKeys.ratings,
      () =>
         apiRequest({
            apiUrl: API_ROUTES.RATING.BATCH,
            method: 'POST',
            data: bookIds,
            shouldRoute: false,
         }),
      {
         enabled: !!data && isSuccess,
      }
   );
}

interface SingleRatingParams {
   bookId: string;
   userId: string;
   initialData?: SingleRateData;
}

export function useGetRating({ bookId, userId, initialData }: SingleRatingParams) {
   return useQuery(
      queryKeys.singleBook(bookId),
      () =>
         apiRequest({
            apiUrl: API_ROUTES.RATING.RATE_BOOK(bookId, userId),
            method: 'GET',
         }),
      {
         enabled: !!bookId && !!userId && !initialData,
         initialData: initialData,
      }
   );
}

// store bookIds into an array of string and store them into query cache
function extractIdsToArray(data: CategoriesQueries, initialData?: CategoriesQueries): string[] {
   function storeIds(data: CategoriesQueries) {
      return Object.values(data)
         .filter(Boolean)
         .flatMap((items) => items!.map((item) => item.id));
   }

   const store = !initialData ? storeIds(data) : storeIds(initialData);

   return store;
}

//
function extraIdsFromArray(bookId: string, initialData?: string[]): string {
   return '';
}
