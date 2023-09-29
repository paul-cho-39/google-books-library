import { TrashIcon } from '@heroicons/react/20/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import queryKeys from '../../utils/queryKeys';
import React from 'react';
import { QueryData } from '../../lib/hooks/useGetBookData';
import { isBookInData } from '../../lib/helper/books/isBooksInLibrary';

interface WrapperProps {
   id: string;
   userId: string;
   toggleHide: () => void;
}
// TODO //
// if clicked EVERY button should be disabled so ATOM would be a great choice
const DeleteButtonWrapper = ({ toggleHide, userId, id }: WrapperProps) => {
   const queryClient = useQueryClient();
   const dataBooks = queryClient.getQueryData<QueryData>(queryKeys.userLibrary(userId));
   const currentlyReading = dataBooks?.library?.currentlyReading;
   const finished = dataBooks?.library?.finished;
   const wantToRead = dataBooks?.library?.wantToRead;
   const booksAbleToDelete = currentlyReading &&
      finished &&
      wantToRead && [...currentlyReading, ...finished, ...wantToRead];

   const isDisplayed = useMemo(
      () => isBookInData(id, booksAbleToDelete as string[]),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [booksAbleToDelete]
   );

   return (
      <button
         className={`${
            !isDisplayed
               ? 'hidden'
               : 'mt-2 w-72 py-3 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
         }`}
         onClick={toggleHide}
      >
         Remove book
         <TrashIcon className='ml-5 h-6' />
         <span className='sr-only'>Remove book </span>
      </button>
   );
};

export default React.memo(DeleteButtonWrapper);
