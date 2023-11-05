import React from 'react';
import DatePicker from 'react-datepicker';
import { useAtom } from 'jotai';
import { initialDateAtom, isMonthUnknownAtom } from '@/lib/store/atomDates';

import 'react-datepicker/dist/react-datepicker.css';
import { useUpdateAtom } from 'jotai/utils';
import Checkmark from '../../icons/checkmark';

const MonthCalendar = () => {
   const [dateValue, setDateValue] = useAtom(initialDateAtom);
   const setUnknown = useUpdateAtom(isMonthUnknownAtom);

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
            showMonthYearPicker
            calendarClassName='first-of-type:leading-[28.5px] first-of-type:h-[190px] ml-1 last-of-type:flex last-of-type:justify-center first-of-type:white first-of-type:text-[0.85rem] w-full tracking-wider font-semibold lg:first-of-type:text-[0.9rem]'
            maxDate={new Date()}
         />
         <Checkmark setUnknown={() => setUnknown()} />
         <button className='sr-only'>
            <span>Click here if you cannot remember the month of the finished date</span>
         </button>
      </>
   );
};

export default MonthCalendar;

// npm uninstall react-date-calendar
