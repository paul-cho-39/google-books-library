import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import Button from './UserActionBaseButton';
import { addBooksBody, getBody } from '@/lib/helper/books/getBookBody';
import useMutateLibrary from '@/lib/hooks/useMutateLibrary';
import { UserActionButtonProps } from '@/lib/types/models/books';
import { LIBRARY_DURATION } from '@/constants/throttle';

const WantToReadButton = ({ book, userId, close, className }: UserActionButtonProps) => {
   const body = addBooksBody(book, book.id);

   const {
      mutation: { mutate, isLoading, isSuccess, isError },
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

   const handleClick = () => {
      mutate(body);

      if (close) {
         setTimeout(() => {
            close();
         }, LIBRARY_DURATION);
      }
   };

   return (
      <>
         <Button
            isLoading={isLoading}
            isDisplayed={isHidden}
            name={'Want to read'}
            onClick={handleClick}
            className={classNames('mb-2', className)}
         />
      </>
   );
};

export default WantToReadButton;
