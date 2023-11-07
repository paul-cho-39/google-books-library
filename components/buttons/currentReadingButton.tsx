import React, { useMemo } from 'react';
import { Items } from '@/lib/types/googleBookTypes';
import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import Button from './basicButton';
import MyToaster from '../bookcards/toaster';
import { addBooksBody, getBody } from '@/lib/helper/books/getBookBody';
import useMutateLibrary from '@/lib/hooks/useMutateLibrary';

export type ButtonProps = {
   book: Items<any>;
   userId: string;
};

const AddPrimary = ({ book, userId }: ButtonProps) => {
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
