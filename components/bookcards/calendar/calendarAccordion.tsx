import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { useEffect, useRef, useState } from 'react';
import { useInitialCalendar } from './calendar';
import { initialDateRecallerAtom, resetDateAtom, resetRecallerAtom } from '@/lib/store/atomDates';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
// helper function for useEffect
import nextAccordion from '@/lib/helper/nextAccordion';

type CalendarProps = ReturnType<typeof useInitialCalendar>;

export const CalendarAccordian: React.FunctionComponent<{
   calendars: CalendarProps;
}> = ({ calendars }) => {
   // store accordion buttons as Refs
   const accordionRefs = useRef<any[]>([]);
   const resetDates = useUpdateAtom(resetDateAtom);
   const resetRecaller = useUpdateAtom(resetRecallerAtom);
   const dateRecaller = useAtomValue(initialDateRecallerAtom);

   useEffect(() => {
      // whenever name changes it closes the current and opens the next following disclosure
      nextAccordion(accordionRefs);
   }, [calendars.year.name, calendars.month.name, dateRecaller]);

   // if the accordion closes the calendar resets
   useEffect(() => {
      resetDates();
      resetRecaller();
   }, [resetDates, resetRecaller]);

   return (
      <div role='dialog' className='flex flex-col items-stretch justify-evenly'>
         {Object.values(calendars).map((calendar, index) => (
            <Disclosure key={calendar.id}>
               {({ open }) => (
                  <>
                     <Disclosure.Button
                        // for closing the accordion
                        aria-expanded={open}
                        data-index-number={open ? calendar.id : 0}
                        ref={(el: any) => (accordionRefs.current[index] = el)}
                        className={`flex w-full justify-between rounded-lg bg-gray-100 px-4 py-3 my-1.5 text-left text-sm font-medium text-black hover:bg-gray-400/20 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75`}
                     >
                        <span>{calendar.name}</span>
                        <ChevronUpIcon
                           className={`${open ? 'rotate-180 transform duration-50' : 'duration-50'}
              h-5 w-5 text-black`}
                        />
                     </Disclosure.Button>
                     <Disclosure.Panel className='px-1 pt-1 pb-5 text-sm text-gray-500 last-of-type:mb-8'>
                        <calendar.Component />
                     </Disclosure.Panel>
                  </>
               )}
            </Disclosure>
         ))}
      </div>
   );
};
