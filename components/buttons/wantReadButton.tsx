import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import Button from './UserActionBaseButton';
import MyToaster from '../bookcards/toaster';
import { addBooksBody, getBody } from '@/lib/helper/books/getBookBody';
import useMutateLibrary from '@/lib/hooks/useMutateLibrary';
import { UserActionButtonProps } from '@/lib/types/models/books';

const WantToReadButton = ({ book, userId, className }: UserActionButtonProps) => {
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
            className={classNames('mb-2', className)}
         />
      </>
   );
};

export default WantToReadButton;
