import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/utils/queryKeys';
import {
   CategoriesQueries,
   MultipleRatingData,
   SingleRatingData,
   ResponseRatingData,
   RatingInfo,
} from '../types/serverTypes';
import apiRequest from '@/utils/fetchData';
import API_ROUTES from '@/utils/apiRoutes';

// returning batch rating of book from /categories and '/'
export default function useGetRatings(data: CategoriesQueries, isSuccess: boolean) {
   const queryClient = useQueryClient();

   const initialData = queryClient.getQueryData<CategoriesQueries>(queryKeys.allGoogleCategories);
   const bookIds = extractIdsToArray(data as CategoriesQueries, initialData);

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
   initialData?: MultipleRatingData | null;
}

export function useGetRating({ bookId, userId, initialData }: SingleRatingParams) {
   const queryClient = useQueryClient();
   const cache = queryClient.getQueryData<MultipleRatingData>(queryKeys.ratingsByBook(bookId));

   const { data, isSuccess, ...queryInfo } = useQuery<
      ResponseRatingData | MultipleRatingData | null,
      unknown,
      MultipleRatingData | null
   >(
      queryKeys.ratingsByBook(bookId),
      async () => {
         const res = (await apiRequest({
            apiUrl: API_ROUTES.RATING.RATE_BOOK.CREATE(userId as string, bookId),
            method: 'GET',
         })) as ResponseRatingData;

         return res.data;
      },
      {
         enabled: !!bookId && !!userId,
         initialData: () => cache ?? initialData,
         select: (data) => {
            // response json and success is there
            if ((data && 'success' in data) || !initialData) {
               const rateData = data as ResponseRatingData;
               return rateData.data;
            }
            return data as MultipleRatingData | null;
         },
         refetchOnWindowFocus: true,
         refetchOnMount: true,
         onSuccess: (data) => {
            const findBook = findId(data, userId);

            if (findBook) {
               queryClient.setQueryData<SingleRatingData>(
                  queryKeys.ratingsByBookAndUser(bookId, userId),
                  findBook
               );
               return;
            }
            return;
         },
      }
   );

   return { data, ...queryInfo };
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

export function findId(
   data: MultipleRatingData | null | undefined,
   userId: string
): SingleRatingData | undefined {
   if (!data || (data.ratingInfo && data.ratingInfo.length < 1)) return;

   const singleRateInfo = data?.ratingInfo?.find((_data) => _data?.userId === userId);

   return {
      avg: data.avg,
      count: data.count,
      inLibrary: data.inLibrary,
      ratingInfo: singleRateInfo as RatingInfo,
   };
}
