import { useMemo } from 'react';
import classNames from 'classnames';
import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import Button from '../buttons/UserActionBaseButton';

import useMutateLibrary from '@/lib/hooks/useMutateLibrary';
import { UserActionButtonProps } from '@/lib/types/models/books';
import { LIBRARY_DURATION } from '@/constants/throttle';

const RemovePrimary = ({ book, userId, className }: UserActionButtonProps) => {
   const { id, volumeInfo: _ } = book;
   const body = { id, userId };

   const {
      mutation: { mutate, isLoading, isSuccess, isError },
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
            name={'Remove Reading'}
            onClick={handleClick}
            className={classNames('mb-2', className)}
         />
      </>
   );
};

export default RemovePrimary;
