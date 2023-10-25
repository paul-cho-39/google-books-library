import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { ButtonProps } from './currentReadingButton';
import queryKeys from '@/utils/queryKeys';
import { initialNullDateAtom, getYear, getMonth, getDay } from '@/lib/store/atomDates';
import { useAtomValue } from 'jotai';
import CalendarModal from '../modal/calendarModal';
import toast, { Toaster } from 'react-hot-toast';
import MyToaster from '../bookcards/toaster';
import { getBody } from '@/lib/helper/books/getBookBody';
import { bookApiUpdate } from '@/utils/fetchData';
import { Library } from '@/lib/types/models/books';

const SaveAsFinishedButton = ({ book, userId }: ButtonProps) => {
   const body = getBody(userId, book);

   const nullDates = useAtomValue(initialNullDateAtom);
   const year = useAtomValue(getYear);
   const month = useAtomValue(getMonth);
   const day = useAtomValue(getDay);

   const queryClient = useQueryClient();
   const dataBooks = queryClient.getQueryData<Library>(queryKeys.userLibrary(userId));
   const finishedBooks = dataBooks?.finished || [];

   const { mutate: mutateUpdate, isLoading } = useMutation(
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
               ...dataBooks,
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
            }, 750);
            queryClient.invalidateQueries(queryKeys.finished);
            queryClient.setQueryData(queryKeys.userLibrary(userId), {
               ...dataBooks,
               library: {
                  ...dataBooks,
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
      mutateUpdate(postBodyWithDates);
   }

   function submitWithoutDate() {
      const { year: nYear, month: nMonth, day: nDay } = nullDates;
      const postBodyWithoutDates = {
         ...body,
         nYear,
         nMonth,
         nDay,
      };
      mutateUpdate(postBodyWithoutDates);
   }

   return (
      <>
         <MyToaster isAdded={true} />
         <CalendarModal
            isLoading={isLoading}
            skipSubmit={submitWithoutDate}
            submitWithDates={submitWithDate}
            className={
               'relative bottom-5 w-[8rem] lg:w-[10rem] inline-flex items-center justify-center rounded-l-2xl border border-gray-400 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 focus:z-10 focus:border-black focus:outline-none focus:ring-1 focus:ring-black'
            }
            modalTitle='Do you remember when you finished the book?'
         >
            {/* contents showing dates here */}
         </CalendarModal>
      </>
   );
};

export default React.memo(SaveAsFinishedButton);
