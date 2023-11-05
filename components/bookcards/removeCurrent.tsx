import { useMutation, useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/utils/queryKeys';
import { ButtonProps } from '../buttons/currentReadingButton';
import filterId from '@/lib/helper/books/filterId';
import { useMemo } from 'react';
import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import Button from '../buttons/basicButton';
import toast from 'react-hot-toast';
import MyToaster from './toaster';
import { bookApiUpdate } from '@/utils/fetchData';
import { Library } from '@/lib/types/models/books';

const RemovePrimary = ({ book, userId }: ButtonProps) => {
   const { id, volumeInfo: _ } = book;
   const body = { id, userId };

   const queryClient = useQueryClient();
   const dataBooks = queryClient.getQueryData<Library>(queryKeys.userLibrary(userId));
   const readingBooks = dataBooks?.reading;

   const { mutate, isLoading } = useMutation(
      queryKeys.deleted,
      () => bookApiUpdate('PUT', userId, 'reading', body),
      {
         onMutate: async () => {
            await queryClient.cancelQueries(queryKeys.deleted, {
               exact: true,
            });
            const previousBookData = readingBooks;
            queryClient.setQueryData(queryKeys.deleted, filterId(readingBooks as string[], id));
            return previousBookData;
         },
         onError: () => {
            toast.error('Failed to add to shelf. Please try again');
            queryClient.cancelQueries(queryKeys.deleted, {
               exact: true,
            });
         },
         onSuccess: () => {
            setTimeout(() => {
               toast.success('Successfully removed from currently reading');
            }, 900);
            queryClient.invalidateQueries(queryKeys.deleted, {
               exact: true,
            });
            queryClient.refetchQueries(queryKeys.primary);
            queryClient.setQueryData(queryKeys.userLibrary(userId), {
               ...dataBooks,
               library: {
                  ...dataBooks,
                  reading: filterId(readingBooks as string[], id),
               },
            });
         },
      }
   );

   const isHidden = useMemo(
      () => isBookInData(book.id, readingBooks),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [readingBooks]
   );

   return (
      <>
         <MyToaster isAdded={false} />
         <Button
            isLoading={isLoading}
            isDisplayed={isHidden}
            name={'Remove Reading'}
            onClick={() => mutate()}
            className={'mb-2'}
         />
      </>
   );
};

export default RemovePrimary;
