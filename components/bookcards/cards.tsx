import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { Items } from '../../lib/types/googleBookTypes';
import SingleOrMultipleAuthors from '../bookcover/authors';
import SaveAsFinishedButton from './finishedButton';
import PopOverButtons from './popover/popoverButtons';
import FilterStatus from './filterStatus';
import useGetBookData, { QueryData } from '../../lib/hooks/useGetBookData';
import BookSearchSkeleton from '../loaders/bookcardsSkeleton';

const Cards: React.FunctionComponent<{
   books: Array<Items<any>> | undefined;
   userId: string;
}> = ({ books, userId }) => {
   const dataBooks = useGetBookData(userId);
   const finishedData = dataBooks?.library?.finished;
   const currentlyReading = dataBooks?.library?.currentlyReading;
   const wantToRead = dataBooks?.library?.wantToRead;

   return (
      <>
         {/* if user has no data then it will keep loading this page no? */}
         {/* if it is the case does dataBooks.length >= 0 work better? */}
         {/* check this part out */}
         {!dataBooks ? (
            <BookSearchSkeleton books={books} />
         ) : (
            <div className='bg-white'>
               <span>Still todo: Filters Here</span>
               <h2 className='font-secondary text-xl font-bold text-gray-900'>Results</h2>
               <div className='mx-auto w-full'>
                  <ul role='listbox' className='divide-y divide-gray-200'>
                     {books &&
                        books?.map((book) => (
                           <React.Fragment key={book?.id}>
                              <li>
                                 <div className='flex items-start px-2 py-4 md:grid md:grid-cols-3 md:gap-0 md:px-28'>
                                    <div className='flex-shrink-0 pr-8 md:col-span-1'>
                                       <Image
                                          src={
                                             book?.volumeInfo.imageLinks &&
                                             book?.volumeInfo.imageLinks.smallThumbnail
                                                ? book?.volumeInfo.imageLinks &&
                                                  book?.volumeInfo.imageLinks.smallThumbnail
                                                : '/unavailableThumbnail.png'
                                          }
                                          alt='Picture of book cover'
                                          width={150}
                                          height={275}
                                          quality={100}
                                          className='h-full w-full object-contain object-center'
                                       />
                                    </div>
                                    {/* <Plates /> */}
                                    {/* TODO: move this into another component  */}
                                    <div className='relative mt-8 px-1 md:col-span-2'>
                                       <div className='grid grid-rows-2 gap-0'>
                                          <h3 className='text-lg font-medium text-gray-900 lg:text-2xlg row-start-1 row-end-2 md:max-w-sm '>
                                             <Link
                                                href='books/[slug]'
                                                as={`/books/${book?.id}`}
                                                passHref
                                             >
                                                <a className='line-clamp-2 text-ellipsis'>
                                                   {book?.volumeInfo.subtitle
                                                      ? book?.volumeInfo.title +
                                                        ': ' +
                                                        book?.volumeInfo.subtitle
                                                      : book?.volumeInfo.title}
                                                </a>
                                             </Link>
                                             <span className='sr-only'>
                                                {book?.volumeInfo.title}:{' '}
                                                {book?.volumeInfo.subtitle}
                                             </span>
                                          </h3>
                                          <p className='row-start-2 w-full text-sm text-clip space-x-0.5 not-first:text-blue-700 not-first:hover:text-blue-500 '>
                                             <span className=''>by{': '}</span>
                                             {!book?.volumeInfo.authors ? (
                                                'Unknown author'
                                             ) : (
                                                <SingleOrMultipleAuthors
                                                   authors={book?.volumeInfo.authors}
                                                />
                                             )}
                                             <span className='sr-only'>
                                                {book?.volumeInfo.authors}
                                             </span>
                                          </p>
                                       </div>
                                       <div className='flex flex-row items-end mt-8 pr-5'>
                                          {/* dropdown buttons for large */}
                                          <SaveAsFinishedButton book={book} userId={userId} />
                                          <PopOverButtons userId={userId} book={book} />
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
                           </React.Fragment>
                        ))}
                  </ul>
               </div>
            </div>
         )}
      </>
   );
};

export default Cards;
