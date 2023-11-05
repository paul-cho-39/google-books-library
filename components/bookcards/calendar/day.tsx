import React from 'react';
import DatePicker from 'react-datepicker';
import { useAtom } from 'jotai';
import { initialDateAtom, isDayUnknownAtom } from '@/lib/store/atomDates';

import 'react-datepicker/dist/react-datepicker.css';
import { useUpdateAtom } from 'jotai/utils';
import Checkmark from '../../icons/checkmark';

// refactoring all of this into one?
const DayCalendar = () => {
   const [dateValue, setDateValue] = useAtom(initialDateAtom);
   const setUnknown = useUpdateAtom(isDayUnknownAtom);

   const handleChange = (date: Date) => {
      setDateValue(date as Date);
   };

   return (
      <>
         <DatePicker
            inline
            selected={dateValue}
            onChange={handleChange}
            startDate={dateValue}
            ariaLabelledBy='Day Picker'
            calendarClassName='ml-1 last-of-type:flex last-of-type:justify-center first-of-type:white first-of-type:text-[0.85rem] w-full tracking-wider font-semibold lg:first-of-type:text-[0.9rem]'
            maxDate={new Date()}
         />
         <Checkmark setUnknown={() => setUnknown()} />
         <button className='sr-only'>
            <span>Click here if you cannot remember the day of the finished date</span>
         </button>
      </>
   );
};

export default DayCalendar;
