import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import queryKeys from '../../lib/queryKeys';
import { ButtonProps } from './currentReadingButton';
import bookApiUpdate from '../../lib/helper/books/bookApiUpdate';
import filterId from '../../lib/helper/filterId';
import { QueryData } from '../../lib/hooks/useGetBookData';
import toast from 'react-hot-toast';
import MyToaster from './toaster';

const DeleteButton = ({ userId, book }: ButtonProps) => {
   const { id, volumeInfo } = book;
   const body = { id, userId };

   const queryClient = useQueryClient();
   // PARSE THIS PART AND REFACTOR
   const dataBooks = queryClient.getQueryData<QueryData>(queryKeys.userLibrary(userId));
   const unfinishedBooks = dataBooks?.library?.unfinished;

   const { mutate, isLoading, isSuccess } = useMutation(
      queryKeys.deleted,
      () => bookApiUpdate('DELETE', userId, 'finished', body),
      {
         onMutate: async () => {
            await queryClient.cancelQueries(queryKeys.deleted);
            const beforeDeletion = unfinishedBooks;
            queryClient.setQueryData(queryKeys.deleted, {
               ...dataBooks?.library,
               unfinished: filterId(unfinishedBooks as string[], id),
            });
            return beforeDeletion;
         },
         onError: () => {
            toast.error('Failed to add to shelf. Please try again');
            queryClient.cancelQueries(queryKeys.deleted);
         },
         onSuccess: () => {
            setTimeout(() => {
               toast.success('Successfully deleted the book');
            }, 900);
            // refactor this part
            queryClient.setQueryData(queryKeys.userLibrary(userId), {
               ...dataBooks,
               library: {
                  finished: filterId(dataBooks?.library?.finished as string[], id),
                  currentlyReading: filterId(dataBooks?.library?.currentlyReading as string[], id),
                  wantToRead: filterId(dataBooks?.library?.wantToRead as string[], id),
               },
            });
            queryClient.refetchQueries(queryKeys.userLibrary(userId));
         },
      }
   );
   return (
      <>
         <MyToaster isAdded={false} />
         <button
            onClick={() => mutate()}
            // disable when lists of books are not available?
            disabled={isLoading}
            className='btn-alert w-36 justify-center text-base'
         >
            {isLoading ? 'deleting...' : 'Delete book'}
            <span className='sr-only'> {isLoading ? 'Loading...' : 'Delete book'}</span>
         </button>
      </>
   );
};

export default React.memo(DeleteButton);
