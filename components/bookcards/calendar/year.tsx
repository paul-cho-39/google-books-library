import React from 'react';
import { useAtom } from 'jotai';
import DatePicker from 'react-datepicker';
import { initialDateAtom, isYearUnknownAtom } from '@/lib/store/atomDates';

import 'react-datepicker/dist/react-datepicker.css';
import { useUpdateAtom } from 'jotai/utils';
import Checkmark from '../../icons/checkmark';

// call callback here

const YearCalendar = () => {
   const [dateValue, setDateValue] = useAtom(initialDateAtom);
   const setUnknown = useUpdateAtom(isYearUnknownAtom);

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
            showYearPicker
            calendarClassName='first-of-type:leading-[30px] first-of-type:h-[200px] ml-1 last-of-type:flex last-of-type:justify-center first-of-type:white first-of-type:text-[0.85rem] w-full tracking-wider font-semibold lg:first-of-type:text-[0.9rem]'
            yearItemNumber={8}
            maxDate={new Date()}
         />
         <Checkmark setUnknown={() => setUnknown()} />
         <button className='sr-only'>
            <span>Click here if you cannot remember the year of the finished date</span>
         </button>
      </>
   );
};

export default YearCalendar;
