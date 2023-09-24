import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RouteNames, RouteParams, decodeRoutes } from '../../constants/routes';
import queryKeys from '../queryKeys';
import { MetaProps } from '../../models/_api/fetchGoogleUrl';

type CategoryRouteParams = RouteParams & {
   maxResultNumber: number;
   pageIndex: number;
   byNewest: boolean | undefined;
};

interface SingleBookQueryParams<TRoute extends CategoryRouteParams | RouteParams> {
   routeParams: TRoute;
}

export default function useGetBookById<TRoute extends CategoryRouteParams | RouteParams>({
   routeParams,
}: SingleBookQueryParams<TRoute>) {
   const queryKey = getQueryKeys(routeParams);

   const queryClient = useQueryClient();
   const cache = queryClient.getQueryData(queryKey, { type: 'all' });

   console.log('----------------------------');
   console.log('the cache here is: ', cache);
   console.log('----------------------------');
   // const dataResult = useQuery(
   //     queryKeys.singleBook(routeParams?.slug as string)
   // )
   // return
}

function getQueryKeys(routeParams: RouteParams) {
   const from = routeParams.from as RouteNames;
   if (from === 'category') {
      const { maxResultNumber, pageIndex, byNewest } = routeParams as CategoryRouteParams;
      const meta: MetaProps = {
         maxResultNumber: Number(maxResultNumber),
         pageIndex: Number(pageIndex),
         byNewest: Boolean(byNewest),
      };

      const queryKey = decodeRoutes[from];
      return queryKey(routeParams.fromQuery, meta);
   }
   const queryKey = decodeRoutes[from];
   return queryKey(routeParams.fromQuery);
}
