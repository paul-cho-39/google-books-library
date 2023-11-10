import { useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback } from 'react';
import { Library } from '../types/models/books';
import queryKeys from '@/utils/queryKeys';
import MyToaster from '@/components/bookcards/toaster';

function useLibraryChangeToaster(userId: string) {
   const queryClient = useQueryClient();
   const [previousLibrary, setPreviousLibrary] = useState<Library | null>(null);
   const currentLibrary = queryClient.getQueryData<Library>(queryKeys.userLibrary(userId));

   // determinining if the library has increased or decreased in size
   const hasLibraryChanged = () => {
      if (currentLibrary) {
         return (
            (previousLibrary?.reading?.length ?? 0) !== (currentLibrary.reading?.length ?? 0) ||
            (previousLibrary?.finished?.length ?? 0) !== (currentLibrary.finished?.length ?? 0) ||
            (previousLibrary?.want?.length ?? 0) !== (currentLibrary.want?.length ?? 0)
         );
      }
   };

   // determining if the library has increased in size
   const hasAdded = () => {
      if (currentLibrary) {
         return (
            (previousLibrary?.reading?.length ?? 0) < (currentLibrary.reading?.length ?? 0) ||
            (previousLibrary?.finished?.length ?? 0) < (currentLibrary.finished?.length ?? 0) ||
            (previousLibrary?.want?.length ?? 0) < (currentLibrary.want?.length ?? 0)
         );
      }
   };

   useEffect(() => {
      const dataBooks = queryClient.getQueryData<Library>(queryKeys.userLibrary(userId));
      if (dataBooks && hasLibraryChanged()) {
         // if it has changed then
         setPreviousLibrary(dataBooks);
      }
   }, [userId, currentLibrary, previousLibrary]);

   // useCallback to memoize the toaster render function
   const added = useCallback(() => {
      if (!previousLibrary) return null;

      const currentLibrary = queryClient.getQueryData<Library>(queryKeys.userLibrary(userId));
      if (!currentLibrary || !hasLibraryChanged()) return null;

      const added = hasAdded();

      return added;
   }, [previousLibrary, currentLibrary, userId]);

   return added();
}

export default useLibraryChangeToaster;
