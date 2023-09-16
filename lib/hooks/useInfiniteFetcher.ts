import { useInfiniteQuery } from '@tanstack/react-query';
import googleApi, { MetaProps } from '../../models/_api/fetchGoogleUrl';
import queryKeys from '../queryKeys';
import { fetcher } from '../../utils/fetchData';

interface FetcherProps {
   search: string;
   meta: (page: number) => MetaProps;
   // meta?: MetaProps;
}

export default function useInfiniteFetcher({ search, meta }: FetcherProps) {
   const { data, isLoading, isFetching, isError, isSuccess, hasNextPage, fetchNextPage } =
      useInfiniteQuery(
         queryKeys.bookSearch(search),
         ({ pageParam = 0 as number }) => fetcher(googleApi.getUrlByQuery(search, meta(pageParam))),
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
