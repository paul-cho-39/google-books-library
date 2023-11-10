import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/utils/queryKeys';
import { bookApiUpdate } from '@/utils/fetchData';
import { Library } from '../types/models/books';
import { ResponseFinishedData } from '../types/serverTypes';

export default function useGetBookData(userId: string) {
   // const queryClient = useQueryClient();

   const { data, isSuccess, ...rest } = useQuery<Library, unknown, Library>(
      queryKeys.userLibrary(userId),
      async () => {
         const res = (await bookApiUpdate('GET', userId, 'main')) as ResponseFinishedData;
         return res.data;
      },
      {
         enabled: !!userId,
         retryOnMount: true,
         refetchOnReconnect: true,
         retry: true,
         retryDelay: (attempt) => attempt * 2000,
         // select: (data) => data,
         notifyOnChangeProps: ['data'],
      }
   );

   // this is not good will exceed maximum depths
   // select should store the queryKeys but storing as ResponseFinishedData
   // if (isSuccess) {
   //    queryClient.setQueryData(queryKeys.userLibrary(userId), data);
   // }

   return {
      data,
      isSuccess,
      ...rest,
   };
}
