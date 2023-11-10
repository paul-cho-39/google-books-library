import { useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Library } from '../types/models/books';
import queryKeys from '@/utils/queryKeys';
import MyToaster, { ToasterMessageType } from '@/components/bookcards/toaster';

function useLibraryChangeToaster(userId: string | null, isInitialSuccess: boolean) {
   const queryClient = useQueryClient();
   const [previousLibrary, setPreviousLibrary] = useState<Library | undefined | null>(null);
   const currentLibrary = queryClient.getQueryData<Library>(
      queryKeys.userLibrary(userId as string)
   );

   // the previous library is the current library on mount
   useEffect(() => {
      if (!previousLibrary || previousLibrary === null) {
         setPreviousLibrary(currentLibrary);
      }
   }, [isInitialSuccess]);

   // determinining if the library has increased or decreased in size
   const hasLibraryChanged = useMemo(() => {
      if (!previousLibrary || !currentLibrary) return false;
      return (
         previousLibrary.reading?.length !== currentLibrary.reading?.length ||
         previousLibrary.finished?.length !== currentLibrary.finished?.length ||
         previousLibrary.want?.length !== currentLibrary.want?.length
      );
   }, [previousLibrary, currentLibrary]);

   // determining if the library has increased in size
   const hasAdded = useMemo(() => {
      if (!previousLibrary || !currentLibrary) return false;
      return (
         (previousLibrary.reading?.length || 0) < (currentLibrary.reading?.length || 0) ||
         (previousLibrary.finished?.length || 0) < (currentLibrary.finished?.length || 0) ||
         (previousLibrary.want?.length || 0) < (currentLibrary.want?.length || 0)
      );
   }, [previousLibrary, currentLibrary]);

   useEffect(() => {
      if (currentLibrary && hasLibraryChanged) {
         // if it has changed then
         setPreviousLibrary(currentLibrary);
      }
   }, [currentLibrary, previousLibrary]);

   const toasterAction: ToasterMessageType | null = useMemo(() => {
      if (!hasLibraryChanged) return null;
      return hasAdded ? 'added' : 'removed';
   }, [hasLibraryChanged, hasAdded]);

   return { toasterAction, MyToaster };
}

export default useLibraryChangeToaster;
