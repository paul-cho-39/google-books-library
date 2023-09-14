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
   const uniqueDataSets = useMemo(
      () => data?.pages && data?.pages[0] && createUniqueDataSets(data),
      [data]
   ) as Array<Items<any>>;

   const totalItems = data?.pages && data?.pages[0] && data?.pages[0].totalItems;

   if (!data || (data?.pages && data?.pages[0].items.length < 1)) {
      console.log('error here');
      return;
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
            {/* if error then display a sign that it could not be fetched */}
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
