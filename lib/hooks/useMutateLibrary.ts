import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { bookApiUpdate } from '@/utils/fetchData';
import {
   BookMutationBaseParams,
   Library,
   MutationLibraryActionTypes,
   MutationLibraryBodyData,
   RefinedBookState,
} from '@/lib/types/models/books';
import queryKeys from '@/utils/queryKeys';
import { Method, UrlProps } from '../types/fetchbody';
import { filterAll, filterId } from '../helper/books/filterId';

function useMutateLibrary<MBody extends MutationLibraryActionTypes>({
   userId,
   bookId,
   type,
}: BookMutationBaseParams) {
   const queryClient = useQueryClient();
   const dataBooks = queryClient.getQueryData<Library>(queryKeys.userLibrary(userId));

   const { method, route, message } = bookUpdateMap[type];

   const mutation = useMutation(
      // the body goes inside mutate(body)
      (body: MutationLibraryBodyData<MBody>) => bookApiUpdate(method, userId, route, body),
      {
         onMutate: async () => {
            // cancel any ongoing queries while mutating
            // should cancel all queries?
            await queryClient.cancelQueries(queryKeys.userLibrary(userId));
            let prevData: Library | undefined;
            if (dataBooks) {
               prevData = dataBooks;
            }

            // optimistic setting
            queryClient.setQueryData(
               queryKeys.userLibrary(userId),
               setUserLibraryData(dataBooks, type, bookId)
            );
            return prevData;
         },
         onError: (err, _variables, context) => {
            console.error('Received an error while mutating, ', err);
            if (context) {
               toast.error(message.onError);
               queryClient.setQueryData(queryKeys.userLibrary(userId), context);
            }
         },
         onSettled: () => {
            queryClient.invalidateQueries(queryKeys.userLibrary(userId));
            toast.success(message.onSuccess);
         },
      }
   );
   return {
      mutation,
      library: dataBooks,
   };
}

function setUserLibraryData(
   currentData: Library | undefined,
   type: MutationLibraryActionTypes,
   bookId: string
) {
   switch (type) {
      case 'finished':
         const updated = addToLibrary(currentData, 'finished', bookId);
         //  remove finished from unfinished
         return removeFromLibrary(updated, 'unfinished', bookId);
      case 'remove':
         return removeFromLibrary(currentData, 'reading', bookId);
      case 'reading':
         return addToLibrary(currentData, 'reading', bookId);
      case 'want':
         return addToLibrary(currentData, 'want', bookId);
      case 'delete':
         return filterAll(currentData, bookId);
      default:
         throw new Error('Ensure the type is one of MutationLibraryActionTypes');
   }
}

function addToLibrary(
   currentData: Library | undefined,
   state: RefinedBookState,
   bookId: string
): Library {
   if (!currentData) {
      const placeholderData: Library = {
         finished: [],
         reading: [],
         unfinished: [],
         want: [],
      };
      return {
         ...placeholderData,
         [state]: [bookId],
      };
   }
   const stateData = currentData[state];
   return {
      ...currentData,
      [state]: [...(stateData || []), bookId],
   };
}

function removeFromLibrary(
   currentData: Library | undefined,
   state: RefinedBookState,
   bookId: string
): Library | undefined {
   // remove the id from the given array
   if (!currentData) return;

   if (!currentData[state]) return;
   return {
      ...currentData,
      [state]: filterId(currentData.reading, bookId),
   };
}

type BookUpdateMap = {
   [key in MutationLibraryActionTypes]: {
      method: Method;
      route: UrlProps;
      message: {
         onSuccess: string;
         onError: string;
      };
   };
};

const bookUpdateMap: BookUpdateMap = {
   finished: {
      method: 'POST',
      route: 'finished',
      message: {
         onSuccess: 'Added to finished library.',
         onError: 'Failed to add to finished library. Please try again',
      },
   },
   reading: {
      method: 'POST',
      route: 'reading',
      message: {
         onSuccess: 'Added to reading library.',
         onError: 'Failed to add to reading library. Please try again',
      },
   },
   want: {
      method: 'POST',
      route: 'want',
      message: {
         onSuccess: 'Added to want to read library.',
         onError: 'Failed to add to want to read library. Please try again',
      },
   },
   delete: {
      method: 'DELETE',
      route: 'main',
      message: {
         onSuccess: 'Deleted from library.',
         onError: 'Failed to add to delete the book. Please try again',
      },
   },
   remove: {
      method: 'PUT',
      route: 'reading',
      message: {
         onSuccess: 'Removed from read library.',
         onError: 'Failed to add to read library. Please try again',
      },
   },
};

export default useMutateLibrary;
