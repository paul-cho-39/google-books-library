import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CategoryRouteParams, RouteNames, RouteParams, decodeRoutes } from '../../constants/routes';
import queryKeys from '../queryKeys';
import googleApi, { MetaProps } from '../../models/_api/fetchGoogleUrl';
import { getBookIdAndSource } from '../../utils/handleIds';
import { Data, GoogleUpdatedFields, Items } from '../types/googleBookTypes';
import { fetcher } from '../../utils/fetchData';

export interface SingleBookQueryParams<TRoute extends CategoryRouteParams | RouteParams> {
   routeParams: TRoute;
   accessFullBookUrl?: boolean;
}

export default function useGetBookById<
   TRoute extends CategoryRouteParams | RouteParams,
   CacheData extends Data<Record<string, string>> | GoogleUpdatedFields
>({ routeParams, accessFullBookUrl = false }: SingleBookQueryParams<TRoute>) {
   // if source is equal to nyt then it should go directly
   // to fetching the data instead of the queryKey;

   const { id, source } = getBookIdAndSource(routeParams.slug as string);
   // home should have this too

   const queryClient = useQueryClient();
   const initialData = queryClient.getQueryData<CacheData>(queryKeys.singleBook(id));

   let book: Items<Record<string, string>> | GoogleUpdatedFields | undefined;
   if (!initialData || initialData === null) {
      const queryKey = getQueryKeys(routeParams);
      const secondaryCache = queryClient.getQueryData<CacheData>(queryKey);
      book = findBookId(secondaryCache, id, source);
   }

   const queryResult = useQuery(
      queryKeys.singleBook(routeParams?.slug as string),
      async () => {
         const url =
            source === 'google' ? googleApi.getUrlByBookId(id) : googleApi.getUrlByIsbn(id);

         const data = await fetcher(url);
         return data;
      },
      {
         initialData: () => initialData || book,
         enabled: !!id && !initialData && !book,
         onSuccess: (data) => queryClient.setQueryData(queryKeys.singleBook(id), data),
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

function getQueryKeys(routeParams: RouteParams | CategoryRouteParams) {
   if (!routeParams.from || !routeParams.fromQuery) return [];

   const from = routeParams.from as RouteNames;
   const lowerCased = routeParams.fromQuery?.toLocaleLowerCase();
   if (from === 'category' || from === 'home') {
      const { maxResultNumber, pageIndex, byNewest } = routeParams as CategoryRouteParams;
      const meta: MetaProps = {
         maxResultNumber: Number(maxResultNumber),
         pageIndex: Number(pageIndex),
         byNewest: byNewest === 'true',
      };

      const queryKey = decodeRoutes[from];
      return queryKey(lowerCased as string, meta);
   }
   const queryKey = decodeRoutes[from];
   return queryKey(lowerCased as string);
}
