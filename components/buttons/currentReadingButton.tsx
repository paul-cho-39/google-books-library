import React, { useMemo } from 'react';
import classNames from 'classnames';

import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import Button from './UserActionBaseButton';
import { addBooksBody } from '@/lib/helper/books/getBookBody';
import useMutateLibrary from '@/lib/hooks/useMutateLibrary';
import { UserActionButtonProps } from '@/lib/types/models/books';
import { LIBRARY_DURATION } from '@/constants/throttle';

const AddPrimary = ({ book, userId, close, className }: UserActionButtonProps) => {
   const { id, volumeInfo: _ } = book;
   const body = addBooksBody(book, id);

   const {
      mutation: { mutate, isLoading, isSuccess, isError },
      library,
   } = useMutateLibrary<'reading'>({
      bookId: id,
      userId: userId,
      type: 'reading',
   });

   const isHidden = useMemo(
      () => !isBookInData(book.id, library?.reading),
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
            name={isLoading ? 'Loading...' : 'Reading currently'}
            onClick={handleClick}
            className={classNames('mb-2', className)}
         />
      </>
   );
};

export default AddPrimary;
