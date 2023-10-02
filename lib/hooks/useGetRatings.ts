import { useQuery, useQueryClient } from '@tanstack/react-query';
import queryKeys from '../../utils/queryKeys';
import { CategoriesQueries } from '../types/serverPropsTypes';
import apiRequest from '../../utils/fetchData';
import API_ROUTES from '../../utils/apiRoutes';

export default function useGetRatings(isSuccess: boolean, data?: CategoriesQueries) {
   const queryClient = useQueryClient();

   if (!isSuccess || !data) return;

   const initialData = queryClient.getQueryData<CategoriesQueries>(queryKeys.allGoogleCategories);

   const bookIds = extractIds(data, initialData);

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

function extractIds(data: CategoriesQueries, initialData?: CategoriesQueries): string[] {
   function storeIds(data: CategoriesQueries) {
      return Object.values(data)
         .filter(Boolean)
         .flatMap((items) => items!.map((item) => item.id));
   }
   const store = !initialData ? storeIds(data) : storeIds(initialData);

   return store;
}
