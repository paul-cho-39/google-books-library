import { ButtonProps } from '../buttons/currentReadingButton';
import { useMemo } from 'react';
import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import Button from '../buttons/basicButton';
import MyToaster from './toaster';

import useMutateLibrary from '@/lib/hooks/useMutateLibrary';

const RemovePrimary = ({ book, userId }: ButtonProps) => {
   const { id, volumeInfo: _ } = book;
   const body = { id, userId };

   const {
      mutation: { mutate, isLoading },
      library,
   } = useMutateLibrary<'remove'>({
      bookId: id,
      userId: userId,
      type: 'remove',
   });

   const isHidden = useMemo(
      () => isBookInData(book.id, library?.reading),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [library]
   );

   return (
      <>
         <MyToaster isAdded={false} />
         <Button
            isLoading={isLoading}
            isDisplayed={isHidden}
            name={'Remove Reading'}
            onClick={() => mutate(body)}
            className={'mb-2'}
         />
      </>
   );
};

export default RemovePrimary;
