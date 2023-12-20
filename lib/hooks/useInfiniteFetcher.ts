import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import googleApi, { MetaProps } from '@/models/_api/fetchGoogleUrl';
import queryKeys from '@/utils/queryKeys';
import { throttledFetcher } from '@/utils/fetchData';
import { FilterProps } from '../types/googleBookTypes';

interface FetcherParams {
   search: string;
   filter: FilterProps;
   meta: (page: number) => MetaProps;
}

/**
 * Custom-built infinite fetcher to implement infinite scrolling and fetching pages
 * @param {Object} params
 * @param {string} params.search - the query that is to be searched
 * @param {Object} params.filter - filters the result from {FilterProps}
 * @param {Function} params.meta - a function to return {MetaProps}
 * @returns
 */
export default function useInfiniteFetcher({ search, filter, meta }: FetcherParams) {
   const getUrlFromFilter = (pageParam: number) => {
      const metaProps = meta(pageParam);

      // filtering the book by its search
      const urlGenerators = {
         all: () => googleApi.getUrlByQuery(search, metaProps),
         author: () =>
            googleApi.getCompleteUrlWithQualifiers(
               {
                  inauthor: search,
                  filter: filter.filterParams,
               },
               metaProps
            ),
         title: () =>
            googleApi.getCompleteUrlWithQualifiers(
               {
                  intitle: search,
                  filter: filter.filterParams,
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
         queryKeys.bookSearch(search.toLocaleLowerCase(), filter),
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
