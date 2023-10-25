import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import googleApi, { MetaProps } from '@/models/_api/fetchGoogleUrl';
import queryKeys from '@/utils/queryKeys';
import { throttledFetcher } from '@/utils/fetchData';
import { FilterProps } from '../types/googleBookTypes';

interface FetcherProps {
   search: string;
   filter: FilterProps;
   meta: (page: number) => MetaProps;
}

export default function useInfiniteFetcher({ search, filter, meta }: FetcherProps) {
   const getUrlFromFilter = (pageParam: number) => {
      const metaProps = meta(pageParam);

      const urlGenerators = {
         all: () => googleApi.getUrlByQuery(search, metaProps),
         author: () =>
            googleApi.getCompleteUrlWithQualifiers(
               {
                  inauthor: search,
                  filter: filter.filterBookParams,
               },
               metaProps
            ),
         title: () =>
            googleApi.getCompleteUrlWithQualifiers(
               {
                  intitle: search,
                  filter: filter.filterBookParams,
               },
               metaProps
            ),
         isbn: () => googleApi.getUrlByIsbn(search),
      };

      const generate = urlGenerators[filter.filterBy];
      const url = generate();
      return url;
   };

   const { data, isLoading, isFetching, isError, error, isSuccess, hasNextPage, fetchNextPage } =
      useInfiniteQuery(
         queryKeys.bookSearch(search.toLocaleLowerCase()),
         ({ pageParam = 0 }) => {
            const url = getUrlFromFilter(pageParam);
            return throttledFetcher(url);
         },
         {
            getNextPageParam: (lastPage, allPages) => {
               // // google book api ordering is off
               // // tested and cannot seem to find the proper ordering?
               let pageParam = 0;
               if (lastPage && allPages) {
                  const totalAllPagesLength = allPages.length;
                  const lastPageItems = allPages[totalAllPagesLength - 1]?.totalItems;

                  if (lastPage.totalItems === lastPageItems) {
                     pageParam = Math.max(pageParam, 15);
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

   if (isError) {
      throw error;
   }

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
