import React, { useEffect, useMemo } from 'react';
import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import Button from './basicButton';
import MyToaster from '../bookcards/toaster';
import { addBooksBody, getBody } from '@/lib/helper/books/getBookBody';
import useMutateLibrary from '@/lib/hooks/useMutateLibrary';
import { UserActionButtonProps } from '@/lib/types/models/books';

const WantToReadButton = ({ book, userId }: UserActionButtonProps) => {
   const body = addBooksBody(book, book.id);

   const {
      mutation: { mutate, isLoading },
      library,
   } = useMutateLibrary<'want'>({
      bookId: book.id,
      userId: userId,
      type: 'want',
   });

   const isHidden = useMemo(
      () => !isBookInData(book.id, library?.want),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [library]
   );

   return (
      <>
         <MyToaster isAdded={true} />
         <Button
            isLoading={isLoading}
            isDisplayed={isHidden}
            name={isLoading ? 'Loading...' : 'Want to read'}
            onClick={() => mutate(body)}
            className={'mb-2'}
         />
      </>
   );
};

export default WantToReadButton;
