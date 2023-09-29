import React, { useEffect, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import queryKeys from '../../utils/queryKeys';
import { isBookInData } from '../../lib/helper/books/isBooksInLibrary';
import Button from './basicButton';
import { ButtonProps } from './currentReadingButton';
import { QueryData } from '../../lib/hooks/useGetBookData';
import toast from 'react-hot-toast';
import MyToaster from '../bookcards/toaster';
import { getBody } from '../../lib/helper/books/getBookBody';
import { bookApiUpdate } from '../../utils/fetchData';

const WantToReadButton = ({ book, userId }: ButtonProps) => {
   const body = getBody(userId, book);
   const queryClient = useQueryClient();
   const dataBooks = queryClient.getQueryData<QueryData>(queryKeys.userLibrary(userId));
   const wantToRead = dataBooks?.library?.wantToRead || [];

   const { mutate, isLoading, isSuccess } = useMutation(
      queryKeys.want,
      () => bookApiUpdate('POST', userId, 'want', body),
      {
         onMutate: async () => {
            await queryClient.cancelQueries(queryKeys.want, {
               exact: true,
            });
            const previousBookData = queryClient.getQueryData(queryKeys.want);
            queryClient.setQueryData(queryKeys.want, {
               ...dataBooks?.library,
               wantToRead: [...(wantToRead as string[]), book.id],
            });
            return previousBookData;
         },
         onError: () => {
            toast.error('Failed to add to shelf. Please try again');
            queryClient.cancelQueries(queryKeys.want, {
               exact: true,
            });
         },
         onSuccess: () => {
            setTimeout(() => {
               toast.success('Successfully added to want to read list');
            }, 750);
            queryClient.invalidateQueries(queryKeys.want);
            queryClient.setQueryData(queryKeys.userLibrary(userId), {
               ...dataBooks,
               library: {
                  ...dataBooks?.library,
                  wantToRead: wantToRead && [...(wantToRead as string[]), book.id],
               },
            });
         },
      }
   );

   useEffect(() => {}, []);

   const isHidden = useMemo(
      () => !isBookInData(book.id, wantToRead),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [wantToRead]
   );

   return (
      <>
         <MyToaster isAdded={true} />
         <Button
            isLoading={isLoading}
            isDisplayed={isHidden}
            name={isLoading ? 'Loading...' : 'Want to read'}
            onClick={() => mutate()}
            className={'mb-2'}
         />
      </>
   );
};

export default WantToReadButton;
