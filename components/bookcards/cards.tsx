import React, { lazy, Suspense } from 'react';
import { Items } from '@/lib/types/googleBookTypes';
import useGetBookData from '@/lib/hooks/useGetBookData';
import { Divider } from '../layout/dividers';
import BookListItem from './search/bookLists';

const Cards: React.FunctionComponent<{
   query: string;
   books: Array<Items<any>> | undefined;
   totalItems: number;
   userId: string | null;
}> = ({ query, books, userId, totalItems }) => {
   // TODO: refetch data and invalidate the data after refetching it
   const { data: databooks, isLoading, isError } = useGetBookData(userId as string);

   return (
      <div className=''>
         <TotalResults result={totalItems} />
         <Divider />
         <div className='mx-auto w-full lg:max-w-2xl'>
            <ul
               aria-label='lists of book result'
               role='listbox'
               className='divide-y-[0.5px] divide-gray-300'
            >
               {books &&
                  books?.map((book) => (
                     <BookListItem
                        key={book.id}
                        book={book}
                        query={query}
                        userId={userId}
                        dataBooks={databooks}
                     />
                  ))}
            </ul>
         </div>
      </div>
   );
};

export const TotalResults = ({ result }: { result: number }) => {
   return (
      <h3
         aria-live='polite'
         data-testid='total-book-results'
         className='mb-4 font-secondary text-xl font-bold text-slate-800 dark:text-slate-100'
      >
         Results: <span>{result}</span>
      </h3>
   );
};

export default Cards;
