import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
   CategoryRouteParams,
   CheckCategoryRouteParams,
   RouteNames,
   RouteParams,
   decodeRoutes,
} from '../../constants/routes';
import queryKeys from '../queryKeys';
import googleApi, { MetaProps } from '../../models/_api/fetchGoogleUrl';
import { getBookIdAndSource } from '../../utils/handleIds';
import { Data, GoogleUpdatedFields } from '../types/googleBookTypes';
import { fetcher } from '../../utils/fetchData';

export interface SingleBookQueryParams<TRoute extends CategoryRouteParams | RouteParams> {
   routeParams: TRoute;
   accessFullBookUrl?: boolean;
}

export default function useGetBookById<
   TRoute extends CategoryRouteParams | RouteParams,
   CacheData extends Data<Record<string, string>> | GoogleUpdatedFields
>({ routeParams, accessFullBookUrl = false }: SingleBookQueryParams<TRoute>) {
   // basically if source is equal to nyt then it should go directly
   // to fetching the data instead of the queryKey;
   const { id, source } = getBookIdAndSource(routeParams.slug as string);
   const queryKey = getQueryKeys(routeParams);
   // home should have this too

   const queryClient = useQueryClient();

   console.log('----------------------------');
   console.log('here is the query Keys before: ', queryKey);

   // FROM HOME AND CATEGORY THIS IS GOOGLEUPDATEDFIELDS
   const cache = queryClient.getQueryData<CacheData>(queryKey);

   const book = findBookId(cache, id, source);

   console.log('----------------------------');
   console.log('the cache here is: ', cache);
   console.log('----------------------------');
   console.log('the BOOK here is: ', book);

   const queryResult = useQuery(
      queryKeys.singleBook(routeParams?.slug as string),
      async () => {
         const url =
            source === 'google' ? googleApi.getUrlByBookId(id) : googleApi.getUrlByIsbn(id);

         const data = await fetcher(url);
         return data;
      },
      {
         initialData: book,
         select: (data) => {
            if (Array.isArray(data)) return data;
         },
         enabled: !cache,
      }
   );
   return queryResult;
}

// different type of depending on cache?
function findBookId<CacheData extends Data<Record<string, string>> | GoogleUpdatedFields>(
   cache: CacheData | undefined,
   id: string,
   source: string
) {
   if (source === 'nyt' || !cache) return;
   if ('items' in cache) {
      return cache?.items.find((book) => book.id === id);
   } else {
      for (const page of cache.pages) {
         for (const item of page.items) {
            if (item.id === id) {
               return item;
            }
         }
      }
   }
   return;
}

function getQueryKeys(routeParams: RouteParams | CategoryRouteParams) {
   const from = routeParams.from as RouteNames;
   const lowerCased = routeParams.fromQuery.toLocaleLowerCase();
   if (from === 'category' || from === 'home') {
      const { maxResultNumber, pageIndex, byNewest } = routeParams as CategoryRouteParams;
      const meta: MetaProps = {
         maxResultNumber: Number(maxResultNumber),
         pageIndex: Number(pageIndex),
         byNewest: byNewest === 'true',
      };

      const queryKey = decodeRoutes[from];
      return queryKey(lowerCased, meta);
   }
   const queryKey = decodeRoutes[from];
   return queryKey(lowerCased);
}
