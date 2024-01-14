import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryRouteParams, RouteNames, RouteParams } from '../types/routes';
import queryKeys from '@/utils/queryKeys';
import googleApi, { MetaProps } from '@/models/_api/fetchGoogleUrl';
import { APISource, getBookIdAndSource } from '@/utils/handleIds';
import { Data, FilterProps, GoogleUpdatedFields, Items } from '../types/googleBookTypes';
import { fetcher, throttledFetcher } from '@/utils/fetchData';
import { decodeRoutes } from '@/utils/routes';
import API_ROUTES from '@/utils/apiRoutes';

// this fetches from cache or from google book data
// NOT FROM API

export interface SingleBookQueryParams<TRoute extends CategoryRouteParams | RouteParams> {
   routeParams: TRoute;
   filter: FilterProps;
   accessFullBookUrl?: boolean;
}

/**
 * @description
 * Client-side cache that initially looks for books that matches against keys cached for a single book.
 * If it is not available it matches the next available cache by looking for the route previous to the current route.
 * The last resort is fetching the book from the proxy server.
 * @param {Object} SingleBookQueryParams
 * @returns {Object}
 */
export default function useGetBookById<
   TRoute extends CategoryRouteParams | RouteParams,
   CacheData extends Data<Record<string, string>> | GoogleUpdatedFields
>({ routeParams, filter, accessFullBookUrl = false }: SingleBookQueryParams<TRoute>) {
   // if source is equal to nyt then it should go directly
   // to fetching the data instead of the queryKey;

   let book: Items<Record<string, string>> | GoogleUpdatedFields | undefined;
   const queryClient = useQueryClient();
   const { id, source } = getBookIdAndSource(routeParams.slug as string);
   const isGoogle = isSource(source, 'google');

   // it first looks for singeBook cache which is the most relevant cache
   // even for nyt book it will retrieve the book object using this cache key
   const initialData = queryClient.getQueryData<CacheData>(queryKeys.singleBook(id));

   // if it is not in the first cache proceed to look inside the second cache
   if (isGoogle && (!initialData || initialData === null)) {
      const queryKey = getQueryKeys(routeParams, filter);
      const secondaryCache = queryClient.getQueryData<CacheData>(queryKey);
      book = findBookId(secondaryCache, id);
   }

   // the third option is to refetch the entire book id
   // NOTE: the data is different from fetching using 'id'
   const { data, isSuccess, isLoading } = useQuery(
      queryKeys.singleBook(routeParams?.slug as string),
      async () => {
         const body = isGoogle ? { type: 'google' } : { type: 'nyt' };
         const res = await fetcher(API_ROUTES.THIRD_PARTY.book(id), {
            method: 'POST',
            body: JSON.stringify(body),
         });

         // if the book is from new york then return new data
         if (!isGoogle) {
            return res.data.items[0];
         }

         return res.data;
      },
      {
         initialData: () => initialData || book,
         enabled: !!id && !initialData && !book,
         //** @TODO - test whether this works */
         onSuccess: (data) => queryClient.setQueryData(queryKeys.singleBook(id), data),
      }
   );

   // console.log('THE DATA BEING RETURNED INSIDE USEGETBOOKBYID IS: ', data);

   return { data, isSuccess, isLoading };
}

function findBookId<CacheData extends Data<Record<string, string>> | GoogleUpdatedFields>(
   cache: CacheData | undefined,
   id: string
) {
   if (!cache) return;
   if ('items' in cache) {
      return cache?.items.find((book) => book.id === id) as unknown as GoogleUpdatedFields;
   } else {
      for (const page of cache.pages) {
         for (const item of page.items) {
            if (item.id === id) {
               return item;
            }
         }
      }
   }
}

function getQueryKeys(routeParams: RouteParams | CategoryRouteParams, filter: FilterProps) {
   if (!routeParams.from || !routeParams.fromQuery) return [];

   const from = routeParams.from as RouteNames;
   const fromQuery = routeParams.fromQuery?.toLocaleLowerCase();
   if (from === 'category' || from === 'home') {
      const { maxResultNumber, pageIndex, byNewest } = routeParams as CategoryRouteParams;
      const meta: MetaProps = {
         maxResultNumber: Number(maxResultNumber),
         pageIndex: Number(pageIndex),
         byNewest: byNewest === 'true', // string not bool
      };

      const queryKey = decodeRoutes[from];
      return queryKey(fromQuery as string, meta);
   }
   // if the path is from 'search' then pass the current filter
   const queryKey = decodeRoutes[from];
   return queryKey(fromQuery as string, filter);
}

function isSource(source: APISource, matching: APISource) {
   return source === matching;
}
