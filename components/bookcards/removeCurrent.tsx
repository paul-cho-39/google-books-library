import { useMemo } from 'react';
import classNames from 'classnames';
import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import Button from '../buttons/UserActionBaseButton';
import MyToaster from './toaster';

import useMutateLibrary from '@/lib/hooks/useMutateLibrary';
import { UserActionButtonProps } from '@/lib/types/models/books';

const RemovePrimary = ({ book, userId, className }: UserActionButtonProps) => {
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
            className={classNames('mb-2', className)}
         />
      </>
   );
};

export default RemovePrimary;
