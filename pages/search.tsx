import { InferGetServerSidePropsType, InferGetStaticPropsType } from 'next';
import { getSession } from 'next-auth/react';
import { Suspense, lazy, useMemo, useRef, useState } from 'react';
import createUniqueDataSets from '../lib/helper/books/filterUniqueData';
import useInteractionObserver from '../lib/hooks/useIntersectionObserver';
import useInfiniteFetcher from '../lib/hooks/useInfiniteFetcher';
import BookSearchSkeleton from '../components/loaders/bookcardsSkeleton';
import { useRouter } from 'next/router';
import { FilterProps, Items } from '../lib/types/googleBookTypes';
import { CustomSession } from '../lib/types/serverTypes';
import EmptyResult from '../components/error/emptyResult';
import { MetaProps } from '../models/_api/fetchGoogleUrl';
import FilterInput from '../components/inputs/filter';
import { Divider } from '../components/layout/dividers';
import SearchLayoutPage from '../components/layout/searchLayout';
import Spinner from '../components/loaders/spinner';
import APIErrorBoundary from '../components/error/errorBoundary';

const Cards = lazy(() => import('../components/bookcards/cards'));

export default function Search(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const { userId } = props;
   // required when selecting the books later to connect w/ api route
   const router = useRouter();
   const search = router.query.q as string;

   const pageLoader = useRef<HTMLDivElement>(null);

   const [filter, setFilter] = useState<FilterProps>({
      filterBy: 'all',
   });

   const meta = (page: number): MetaProps => {
      return {
         maxResultNumber: 15,
         pageIndex: page ?? 0,
         byNewest: false,
      };
   };

   const { data, isLoading, isFetching, isError, isSuccess, hasNextPage, fetchNextPage } =
      useInfiniteFetcher({ search, filter, meta });

   useInteractionObserver({
      enabled: !!hasNextPage,
      onIntersect: fetchNextPage,
      target: pageLoader,
   });

   // filtering duplicated results
   // and because of this 'totalItems' is not true number
   const uniqueDataSets: Array<Items<any>> = useMemo(
      () => data?.pages && data?.pages[0] && createUniqueDataSets(data),
      [data]
   );

   const totalItems = data?.pages?.[0]?.totalItems || 0;

   if (!data && (isLoading || isFetching)) {
      return (
         <SearchLayoutPage isSuccess={false}>
            <FilterInput filter={filter} setFilter={setFilter} />
            <Divider />
            <Spinner />
         </SearchLayoutPage>
      );
   }

   if (!data || isError || ((!isLoading || !isFetching) && totalItems < 1)) {
      return (
         <EmptyResult isError={isError} query={search}>
            <FilterInput filter={filter} setFilter={setFilter} />
         </EmptyResult>
      );
   }

   // TODO: error boundary here;
   return (
      <APIErrorBoundary>
         <SearchLayoutPage isSuccess={true}>
            <main>
               <FilterInput filter={filter} setFilter={setFilter} />
               <div>
                  {isFetching && isLoading ? (
                     <BookSearchSkeleton books={5} />
                  ) : (
                     isSuccess && (
                        <Suspense fallback={<BookSearchSkeleton books={5} />}>
                           <Cards
                              query={search}
                              books={uniqueDataSets}
                              userId={userId}
                              totalItems={totalItems}
                           />
                        </Suspense>
                     )
                  )}
               </div>
            </main>
            <div ref={pageLoader}></div>
         </SearchLayoutPage>
      </APIErrorBoundary>
   );
}

export const getServerSideProps = async (context: any) => {
   const session = await getSession(context);
   const user = session?.user as CustomSession;
   const userId = user?.id || null;
   return {
      props: {
         userId: userId,
      },
   };
};
