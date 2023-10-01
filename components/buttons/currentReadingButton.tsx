import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { Items } from '../../lib/types/googleBookTypes';
import queryKeys from '../../utils/queryKeys';
import { isBookInData } from '../../lib/helper/books/isBooksInLibrary';
import Button from './basicButton';
import { QueryData } from '../../lib/hooks/useGetBookData';
import MyToaster from '../bookcards/toaster';
import { toast } from 'react-hot-toast';
import { getBody } from '../../lib/helper/books/getBookBody';
import { bookApiUpdate } from '../../utils/fetchData';

export type ButtonProps = {
   book: Items<any>;
   userId: string;
};

const AddPrimary = ({ book, userId }: ButtonProps) => {
   const { id, volumeInfo: _ } = book;
   const body = getBody(userId, book);

   const queryClient = useQueryClient();
   const dataBooks = queryClient.getQueryData<QueryData>(queryKeys.userLibrary(userId));

   const currentlyReading = dataBooks?.library?.currentlyReading || [];

   const { mutate: mutateUpdate, isLoading } = useMutation(
      queryKeys.currentlyReading,
      () => bookApiUpdate('POST', userId, 'reading', body),
      {
         onMutate: async () => {
            await queryClient.cancelQueries(queryKeys.currentlyReading);
            const previousBookData = currentlyReading;
            queryClient.setQueryData(queryKeys.currentlyReading, {
               ...dataBooks?.library,
               currentlyReading: currentlyReading && [...(currentlyReading as string[]), book.id],
            });
            return previousBookData;
         },
         onError: () => {
            toast.error('Failed to add to shelf. Please try again');
            queryClient.cancelQueries(queryKeys.currentlyReading, {
               exact: true,
            });
         },
         onSuccess: () => {
            setTimeout(() => {
               toast.success('Successfully added to currently reading');
            }, 750);
            queryClient.invalidateQueries(queryKeys.currentlyReading, {
               exact: true,
            });
            queryClient.setQueryData(queryKeys.userLibrary(userId), {
               ...dataBooks,
               library: {
                  ...dataBooks?.library,
                  currentlyReading: currentlyReading && [
                     ...(currentlyReading as string[]),
                     book.id,
                  ],
               },
            });
         },
      }
   );
   const isHidden = useMemo(
      () => !isBookInData(book.id, currentlyReading),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currentlyReading]
   );

   const handleClick = () => {
      mutateUpdate();
   };

   return (
      <>
         <MyToaster isAdded={true} />
         <Button
            isLoading={isLoading}
            isDisplayed={isHidden}
            name={isLoading ? 'Loading...' : 'Reading currently'}
            onClick={handleClick}
            className={'mb-2'}
         />
      </>
   );
};

export default AddPrimary;
