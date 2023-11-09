import React, { useMemo } from 'react';
import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import Button from './basicButton';
import MyToaster from '../bookcards/toaster';
import { addBooksBody, getBody } from '@/lib/helper/books/getBookBody';
import useMutateLibrary from '@/lib/hooks/useMutateLibrary';
import { UserActionButtonProps } from '@/lib/types/models/books';

const AddPrimary = ({ book, userId }: UserActionButtonProps) => {
   const { id, volumeInfo: _ } = book;
   const body = addBooksBody(book, id);

   const {
      mutation: { mutate, isLoading },
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
