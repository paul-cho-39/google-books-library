import React from 'react';
import { initialNullDateAtom, getYear, getMonth, getDay } from '@/lib/store/atomDates';
import { useAtomValue } from 'jotai';
import CalendarModal from '../modal/calendarModal';

import { addBooksBody, getBody } from '@/lib/helper/books/getBookBody';
import useMutateLibrary from '@/lib/hooks/useMutateLibrary';
import { UserActionButtonProps } from '@/lib/types/models/books';

const SaveAsFinishedButton = ({ book, userId }: UserActionButtonProps) => {
   const body = addBooksBody(book, book.id);

   const nullDates = useAtomValue(initialNullDateAtom);
   const year = useAtomValue(getYear);
   const month = useAtomValue(getMonth);
   const day = useAtomValue(getDay);

   const {
      mutation: { mutate, isLoading },
   } = useMutateLibrary<'finished'>({
      bookId: book.id,
      userId: userId,
      type: 'finished',
   });

   // lazy load atoms here?
   function submitWithDate() {
      const postBodyWithDates = { ...body, year, month, day };
      mutate(postBodyWithDates);
   }

   function submitWithoutDate() {
      const postBodyWithoutDates = {
         ...body,
         ...nullDates,
      };
      mutate(postBodyWithoutDates);
   }

   return (
      <CalendarModal
         isLoading={isLoading}
         skipSubmit={submitWithoutDate}
         submitWithDates={submitWithDate}
         modalTitle='Finished'
         className={
            'relative bottom-5 w-[8rem] lg:w-[10rem] inline-flex items-center justify-center rounded-l-2xl border border-gray-400 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 focus:z-10 focus:border-black focus:outline-none focus:ring-1 focus:ring-black'
         }
      >
         {/* contents showing dates here */}
      </CalendarModal>
   );
};

export default SaveAsFinishedButton;
