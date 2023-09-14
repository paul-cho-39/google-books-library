import { useInfiniteQuery } from '@tanstack/react-query';
import googleApi from '../../models/_api/fetchGoogleUrl';
import queryKeys from '../queryKeys';
import { fetcher } from '../../utils/fetchData';

interface FetcherProps {
   search: string;
   maxResult?: number;
}

export default function useInfiniteFetcher({ search, maxResult = 15 }: FetcherProps) {
   const { data, isLoading, isFetching, isError, isSuccess, hasNextPage, fetchNextPage } =
      useInfiniteQuery(
         queryKeys.bookSearch(search),
         ({ pageParam = 0 }) => fetcher(googleApi.getUrlByQuery(search, maxResult, pageParam)),
         {
            getNextPageParam: (lastPage, allPages) => {
               // // google book api ordering is off
               // // tested this but cannot seem to find the proper ordering?
               let pageParam = 1;
               if (lastPage && allPages) {
                  const totalAllPagesLength = allPages.length;
                  const lastPageItems = allPages[totalAllPagesLength - 1]?.totalItems;

                  if (lastPage.totalItems === lastPageItems) {
                     return totalAllPagesLength * pageParam;
                  } else {
                     return undefined;
                  }
               }
            },
            enabled: !!search,
            keepPreviousData: true,
         }
      );
   return {
      data,
      isLoading,
      isFetching,
      isError,
      isSuccess,
      hasNextPage,
      fetchNextPage,
   };
}
