import { InferGetServerSidePropsType, InferGetStaticPropsType } from 'next';
import getUserId from '../../../lib/helper/getUserId';
import { getSession } from 'next-auth/react';
import { useMemo, useRef, useState } from 'react';
import createUniqueDataSets from '../../../lib/helper/books/filterUniqueData';
import useInteractionObserver from '../../../lib/hooks/useIntersectionObserver';
import Cards from '../../../components/bookcards/cards';
import useInfiniteFetcher from '../../../lib/hooks/useInfiniteFetcher';
// import { BookGetter } from "../../../lib/prisma/class/bookGetter";
import BookSearchSkeleton from '../../../components/loaders/bookcardsSkeleton';

export default function Search(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
   // required when selecting the books later to connect w/ api route
   const { userId } = props;
   const [query, setQuery] = useState('');
   const [search, setSearch] = useState('');

   const searchBooks = (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      if (!query && search.length <= 1) return;
      // debounce search result
      setTimeout(() => {
         setSearch(query);
      }, 450);
   };

   const { data, isLoading, isFetching, isError, isSuccess, hasNextPage, fetchNextPage } =
      useInfiniteFetcher({ search });

   // lazy-loader here
   // enabling infinite scroll
   const pageLoader = useRef<HTMLDivElement>(null);

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

   // TODO //
   // if isError then return 404 page that page cannot be found
   // put this inside the container
   return (
      <>
         <div className=''>
            <form onSubmit={searchBooks}>
               <input
                  className='border-2 border-black py-2 px-1'
                  onChange={(e) => setQuery(e.target.value)}
               />
               <button type='submit'>Search</button>
            </form>
            <div>
               {/* replace this with Suspense? */}
               <div>
                  {isFetching && isLoading ? (
                     <BookSearchSkeleton books={uniqueDataSets} />
                  ) : isSuccess ? (
                     <Cards books={uniqueDataSets} userId={userId} />
                  ) : null}
               </div>
               {/* if error then display a sign that it could not be fetched */}
            </div>
         </div>
         {/* add scroll if down lower */}
         <div ref={pageLoader}></div>
      </>
   );
}

export const getServerSideProps = async (context: any) => {
   const getUser = await getSession(context);
   const userId = getUserId(getUser as object, 'id');
   return {
      props: {
         userId: userId,
      },
   };
};
