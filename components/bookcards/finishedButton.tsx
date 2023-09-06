import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import bookApiUpdate, { getBody } from '../../lib/helper/books/bookApiUpdate';
import { ButtonProps } from './currentReadingButton';
import queryKeys from '../../lib/queryKeys';
import { initialNullDateAtom, getYear, getMonth, getDay } from '../../lib/store/atomDates';
import { useAtomValue } from 'jotai';
import CalendarModal from './calendar/calendarModal';
import { QueryData } from '../../lib/hooks/useGetBookData';
import toast, { Toaster } from 'react-hot-toast';
import MyToaster from './toaster';

const SaveAsFinishedButton = ({ book, userId }: ButtonProps) => {
   const body = getBody(userId, book);
   // import atoms here?
   const nullDates = useAtomValue(initialNullDateAtom);
   const year = useAtomValue(getYear);
   const month = useAtomValue(getMonth);
   const day = useAtomValue(getDay);

   const queryClient = useQueryClient();
   const dataBooks = queryClient.getQueryData<QueryData>(queryKeys.userLibrary(userId));
   const finishedBooks = dataBooks?.library?.finished;

   const { mutateAsync: mutateDelete } = useMutation(() => bookApiUpdate('DELETE', userId, ''));

   const { mutateAsync: mutateUpdate, isLoading } = useMutation(
      queryKeys.finished,
      (body: any) => bookApiUpdate('POST', userId, 'finished', body),
      {
         onMutate: async () => {
            await queryClient.cancelQueries(queryKeys.finished, {
               exact: true,
            });
            const previousBookData = finishedBooks;
            // creating an object of array not an object of object
            queryClient.setQueryData(queryKeys.finished, {
               ...dataBooks?.library,
               finished: [...(finishedBooks as string[]), book.id],
            });
            return previousBookData;
         },
         onError: () => {
            toast.error('Failed to add to shelf. Please try again');
            queryClient.cancelQueries(queryKeys.finished);
         },
         onSuccess: () => {
            setTimeout(() => {
               toast.success('Successfully added to finished library');
            }, 300);
            queryClient.invalidateQueries(queryKeys.finished);
            queryClient.setQueryData(queryKeys.userLibrary(userId), {
               ...dataBooks,
               library: {
                  ...dataBooks?.library,
                  finished: [...(finishedBooks as string[]), book.id],
               },
            });
         },
      }
   );

   // lazy load atoms here?
   function submitWithDate() {
      // dynamically import all files here?
      const postBodyWithDates = { ...body, year, month, day };
      mutate(postBodyWithDates);
   }

   function submitWithoutDate() {
      const { year: nYear, month: nMonth, day: nDay } = nullDates;
      const postBodyWithoutDates = {
         ...body,
         nYear,
         nMonth,
         nDay,
      };
      mutate(postBodyWithoutDates);
   }
   const current = new Date(year, month, day);
   // disabled if the id of finished book is finished already
   return (
      <>
         <MyToaster isAdded={true} />
         <CalendarModal
            isLoading={isLoading}
            skipSubmit={submitWithoutDate}
            submitWithDates={submitWithDate}
            className={
               'relative bottom-5 w-[8rem] inline-flex items-center rounded-l-2xl border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
            }
            modalTitle='Do you remember when you finished the book?'
         >
            {/* contents showing dates here */}
         </CalendarModal>
      </>
   );
};

export default React.memo(SaveAsFinishedButton);
