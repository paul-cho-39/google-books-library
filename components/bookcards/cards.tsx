import Link from 'next/link';
import React, { lazy, Suspense } from 'react';
import { Items } from '../../lib/types/googleBookTypes';
import SingleOrMultipleAuthors from '../bookcover/authors';
import FilterStatus from './filterStatus';
import useGetBookData, { QueryData } from '../../lib/hooks/useGetBookData';
import { getBookWidth } from '../../utils/getBookWidth';
import BookImage from '../bookcover/bookImages';
import SignInRequiredButton from '../Login/requireUser';
import BookTitle from '../bookcover/title';
import { Divider } from '../layout/dividers';
import routes from '../../constants/routes';

const HEIGHT = 125;

const SaveAsFinishedButton = lazy(() => import('./finishedButton'));
const PopOverButtons = lazy(() => import('./popover/popoverButtons'));

const Cards: React.FunctionComponent<{
   query: string;
   books: Array<Items<any>> | undefined;
   totalItems: number;
   userId: string | null;
}> = ({ query, books, userId, totalItems }) => {
   const dataBooks = useGetBookData(userId);
   const finishedData = dataBooks?.library?.finished;
   const currentlyReading = dataBooks?.library?.currentlyReading;
   const wantToRead = dataBooks?.library?.wantToRead;

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
                     <li role='list' key={book?.id}>
                        <div className='flex items-start px-2 py-4'>
                           <div className='flex-shrink-0'>
                              <BookImage
                                 id={book.id}
                                 bookImage={book.volumeInfo.imageLinks}
                                 height={HEIGHT}
                                 width={getBookWidth(HEIGHT)}
                                 priority
                                 title={book.volumeInfo.title}
                                 routeQuery={routes.search(query)}
                              />
                           </div>
                           {/* title + author + button */}
                           <div className='relative grid grid-rows-5 px-4 md:px-6 lg:px-8'>
                              <div className='row-span-3 '>
                                 <div className='row-start-1 row-end-2 md:max-w-sm'>
                                    <BookTitle
                                       id={book.id}
                                       routeQuery={routes.search(query)}
                                       hasLink
                                       title={book?.volumeInfo.title}
                                       subtitle={book?.volumeInfo.subtitle}
                                       className='text-lg lg:text-xl hover:underline hover:underline-offset-1 hover:decoration-slate-200 dark:hover:decoration-slate-300'
                                    />
                                 </div>
                                 <p className='row-start-2 w-full text-sm text-clip space-x-0.5 '>
                                    <span className='dark:text-slate-50'>by{': '}</span>
                                    <SingleOrMultipleAuthors
                                       hoverUnderline={true}
                                       authors={book?.volumeInfo.authors}
                                    />
                                 </p>
                              </div>
                              {/* dropdown buttons for large */}
                              <div className='flex flex-row items-end w-full pr-5'>
                                 <SignInRequiredButton
                                    type='finished'
                                    userId={userId}
                                    signedInActiveButton={
                                       <SaveAsFinishedButton
                                          book={book}
                                          userId={userId as string}
                                       />
                                    }
                                 />
                                 <SignInRequiredButton
                                    type='popover'
                                    userId={userId}
                                    signedInActiveButton={
                                       <PopOverButtons book={book} userId={userId as string} />
                                    }
                                 />
                              </div>
                              <FilterStatus
                                 bookId={book.id}
                                 currentlyReading={currentlyReading}
                                 finishedData={finishedData}
                                 wantToRead={wantToRead}
                              />
                           </div>
                        </div>
                     </li>
                  ))}
            </ul>
         </div>
      </div>
   );
};

export const TotalResults = ({ result }: { result: number }) => {
   return (
      <h3 className='mb-4 font-secondary text-xl font-bold text-slate-800 dark:text-slate-100'>
         Results: <span>{result}</span>
      </h3>
   );
};

export default Cards;
