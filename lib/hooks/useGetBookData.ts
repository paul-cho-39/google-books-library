import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import queryKeys from '../../utils/queryKeys';
import { bookApiUpdate } from '../../utils/fetchData';
import { Library } from '../types/models/books';
import { ResponseFinishedData } from '../types/serverTypes';

export default function useGetBookData(userId: string) {
   const { data: dataBooks } = useQuery<ResponseFinishedData, unknown, Library>(
      queryKeys.userLibrary(userId),
      () => bookApiUpdate('GET', userId, 'finished'),
      {
         enabled: !!userId,
         retryOnMount: true,
         refetchOnReconnect: true,
         retry: true,
         retryDelay: (attempt) => attempt * 2000,
         select: (data) => data.data,
      }
   );

   console.log('INSIDE useGetBookData.ts and data is:, ', dataBooks);
   return dataBooks;
}
