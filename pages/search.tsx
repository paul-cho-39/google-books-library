import { InferGetServerSidePropsType, InferGetStaticPropsType } from 'next';
import getUserId from '../lib/helper/getUserId';
import { getSession } from 'next-auth/react';
import { useMemo, useRef, useState } from 'react';
import createUniqueDataSets from '../lib/helper/books/filterUniqueData';
import useInteractionObserver from '../lib/hooks/useIntersectionObserver';
import Cards from '../components/bookcards/cards';
import useInfiniteFetcher from '../lib/hooks/useInfiniteFetcher';
// import { BookGetter } from "../../../lib/prisma/class/bookGetter";
import BookSearchSkeleton from '../components/loaders/bookcardsSkeleton';
import { useRouter } from 'next/router';

export default function Search() {
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
   );

   const totalItems = data?.pages[1].totalItems;

   // TODO: layout page and should be good(?);
   return (
      <div className='mx-auto px-4 lg:px-16 lg:py-2 dark:slate-800'>
         <div>
            {/* replace this with Suspense? */}
            <div>
               {isFetching && isLoading ? (
                  <BookSearchSkeleton books={uniqueDataSets} />
               ) : (
                  isSuccess && <Cards books={uniqueDataSets} totalItems={totalItems} />
               )}
            </div>
            {/* if error then display a sign that it could not be fetched */}
         </div>
         {/* add scroll if down lower */}
         <div ref={pageLoader}></div>
      </div>
   );
}
