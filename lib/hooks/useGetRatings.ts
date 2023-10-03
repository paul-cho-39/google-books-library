import { useQuery, useQueryClient } from '@tanstack/react-query';
import queryKeys from '../../utils/queryKeys';
import { CategoriesQueries } from '../types/serverPropsTypes';
import apiRequest from '../../utils/fetchData';
import API_ROUTES from '../../utils/apiRoutes';

// returning batch rating of book from /categories and '/'
export default function useGetRatings(isSuccess: boolean, data?: CategoriesQueries) {
   const queryClient = useQueryClient();

   if (!isSuccess || !data) return;

   const initialData = queryClient.getQueryData<CategoriesQueries>(queryKeys.allGoogleCategories);
   const bookIds = extractIdsToArray(data, initialData);

   // debugging
   console.log('-------------------------');
   console.log('the INITIAL DATA IS : ', initialData);
   console.log('-------------------------');
   // debugging
   console.log('-------------------------');
   console.log('the book ids are : ', bookIds);
   console.log('-------------------------');

   // require dynamic?
   //    useQuery(
   //       queryKeys.ratings,
   //       () =>
   //          apiRequest({
   //             apiUrl: API_ROUTES.RATING.BATCH,
   //             method: 'POST',
   //             data: bookIds,
   //             shouldRoute: false,
   //          }),
   //       {
   //          enabled: !!data,
   //       }
   //    );
}

interface SingleRatingParams {
   bookId: string;
   userId: string;
}

export function useGetRating({ bookId, userId }: SingleRatingParams) {
   const queryClient = useQueryClient();
   const initialData = queryClient.getQueryData(queryKeys.ratings, {
      stale: false,
      type: 'active',
   });

   // see what the type is for the data

   const queryData = useQuery(
      queryKeys.singleBook(bookId),
      () =>
         apiRequest({
            apiUrl: API_ROUTES.RATING.RATE_BOOK(bookId, userId),
            method: 'GET',
         }),
      {
         enabled: !!bookId && !!userId,
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
