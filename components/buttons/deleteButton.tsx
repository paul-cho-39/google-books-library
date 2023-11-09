import React, { useEffect, useMemo, useState } from 'react';
import MyToaster from '../bookcards/toaster';
import useMutateLibrary from '@/lib/hooks/useMutateLibrary';
import { UserActionButtonProps } from '@/lib/types/models/books';

const DeleteButton = ({ userId, book }: UserActionButtonProps) => {
   const { id, volumeInfo: _ } = book;
   const body = { id, userId };

   const {
      mutation: { mutate, isLoading },
   } = useMutateLibrary<'delete'>({
      bookId: id,
      userId: userId,
      type: 'delete',
   });

   return (
      <>
         <MyToaster isAdded={false} />
         <button
            onClick={() => mutate(body)}
            // disable when lists of books are not available?
            disabled={isLoading}
            className='btn-alert w-36 justify-center text-base'
         >
            {isLoading ? 'deleting...' : 'Delete book'}
            <span className='sr-only'> {isLoading ? 'Loading...' : 'Delete book'}</span>
         </button>
      </>
   );
};

export default DeleteButton;
