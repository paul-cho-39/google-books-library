import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { bookApiUpdate } from '@/utils/fetchData';
import {
   BookMutationBaseParams,
   Library,
   MutationLibraryActionTypes,
   MutationLibraryBodyData,
   MutationLibraryBodyTypes,
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
      (body: MutationLibraryBodyData<MBody>) =>
         bookApiUpdate(method as Method, userId, route as UrlProps, body),
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

const bookUpdateMap = {
   finished: {
      method: 'POST',
      route: 'finished',
      message: {
         onSuccess: 'Successfully added to finished library.',
         onError: 'Failed to add to finished library. Please try again',
      },
   },
   reading: {
      method: 'POST',
      route: 'reading',
      message: {
         onSuccess: 'Successfully added to reading library.',
         onError: 'Failed to add to reading library. Please try again',
      },
   },
   want: {
      method: 'POST',
      route: 'want',
      message: {
         onSuccess: 'Successfully added to want to read library.',
         onError: 'Failed to add to want to read library. Please try again',
      },
   },
   delete: {
      method: 'DELETE',
      route: 'finished',
      message: {
         onSuccess: 'Successfully deleted from library.',
         onError: 'Failed to add to delete the book. Please try again',
      },
   },
   remove: {
      method: 'PUT',
      route: 'reading',
      message: {
         onSuccess: 'Successfully removed from read library.',
         onError: 'Failed to add to read library. Please try again',
      },
   },
};

export default useMutateLibrary;
