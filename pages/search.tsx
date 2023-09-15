import { InferGetServerSidePropsType, InferGetStaticPropsType } from 'next';
import { getSession } from 'next-auth/react';
import { Suspense, lazy, useMemo, useRef, useState } from 'react';
import createUniqueDataSets from '../lib/helper/books/filterUniqueData';
import useInteractionObserver from '../lib/hooks/useIntersectionObserver';
import useInfiniteFetcher from '../lib/hooks/useInfiniteFetcher';
import BookSearchSkeleton from '../components/loaders/bookcardsSkeleton';
import { useRouter } from 'next/router';
import { Items } from '../lib/types/googleBookTypes';
import { CustomSession } from '../lib/types/serverPropsTypes';
import EmptyResult from '../components/bookcards/emptyResult';

const Cards = lazy(() => import('../components/bookcards/cards'));

export default function Search(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const { userId } = props;
   // required when selecting the books later to connect w/ api route
   const router = useRouter();
   const search = router.query.q as string;
   const pageLoader = useRef<HTMLDivElement>(null);

   const { data, isLoading, isFetching, isError, isSuccess, hasNextPage, fetchNextPage } =
      useInfiniteFetcher({ search });

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

   if (!data || isError || ((!isLoading || !isFetching) && totalItems < 1)) {
      return <EmptyResult isError={isError} query={search} />;
   }

   return (
      <div className='mx-auto px-4 lg:px-16 lg:py-2 dark:slate-800'>
         <div>
            <div>
               {isFetching && isLoading ? (
                  <BookSearchSkeleton books={5} />
               ) : (
                  isSuccess && (
                     <Suspense fallback={<BookSearchSkeleton books={5} />}>
                        <Cards books={uniqueDataSets} userId={userId} totalItems={totalItems} />
                     </Suspense>
                  )
               )}
            </div>
         </div>
         <div ref={pageLoader}></div>
      </div>
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