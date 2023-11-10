import { useEffect, useMemo } from 'react';
import { TrashIcon } from '@heroicons/react/20/solid';
import { useQueryClient } from '@tanstack/react-query';
import queryKeys from '@/utils/queryKeys';
import React from 'react';
import { isBookInData, isBookInDataBooks } from '@/lib/helper/books/isBooksInLibrary';
import { Library, UserActionButtonProps } from '@/lib/types/models/books';
import Button from '../UserActionBaseButton';

interface WrapperProps extends UserActionButtonProps {
   toggleHide?: () => void;
}
const DeleteButtonWrapper = ({ userId, book, className, toggleHide }: WrapperProps) => {
   const { id, _ } = book;
   const queryClient = useQueryClient();
   const dataBooks = queryClient.getQueryData<Library>(queryKeys.userLibrary(userId));

   const isDisplayed = useMemo(
      () => isBookInDataBooks(dataBooks, id),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [dataBooks]
   );

   return (
      // this should be modal correct?
      <Button
         isDisplayed={isDisplayed}
         name='Remove book'
         onClick={toggleHide}
         isDeleteButton={true}
         Icon={<TrashIcon title='Remove from Library' aria-hidden={true} className='h-4 lg:h-6' />}
         iconDetails='Remove book icon'
         className={className}
      />
   );
};

export default DeleteButtonWrapper;
