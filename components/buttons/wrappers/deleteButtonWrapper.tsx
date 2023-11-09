import { TrashIcon } from '@heroicons/react/20/solid';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import queryKeys from '@/utils/queryKeys';
import React from 'react';
import { isBookInData, isBookInDataBooks } from '@/lib/helper/books/isBooksInLibrary';
import { Library } from '@/lib/types/models/books';
import Button from '../UserActionBaseButton';

interface WrapperProps {
   id: string;
   userId: string;
   toggleHide?: () => void;
}
const DeleteButtonWrapper = ({ userId, id, toggleHide }: WrapperProps) => {
   const queryClient = useQueryClient();
   const dataBooks = queryClient.getQueryData<Library>(queryKeys.userLibrary(userId));

   const isDisplayed = useMemo(
      () => isBookInDataBooks(dataBooks, id),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [dataBooks]
   );

   return (
      <Button
         isDisplayed={isDisplayed}
         name='Remove book'
         onClick={toggleHide}
         Icon={<TrashIcon title='Remove from Library' aria-hidden={true} className='ml-5 h-6' />}
         iconDetails='Remove book icon'
      />
   );
};

export default DeleteButtonWrapper;
