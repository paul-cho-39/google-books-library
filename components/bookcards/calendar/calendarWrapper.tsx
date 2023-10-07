import React from 'react';
import { initialDateRecallerAtom } from '../../../lib/store/atomDates';
import ButtonWrapper from '../../buttons/wrappers/buttonWrapper';
import { useInitialCalendar } from './calendar';
import { CalendarAccordian } from './calendarAccordion';

// void?
interface CalendarProps {
   skipSubmit: () => void;
   submitWithDates: () => void;
   isLoading?: boolean;
}

export const CalendarWrapper = ({ skipSubmit, submitWithDates, isLoading }: CalendarProps) => {
   const calendars = useInitialCalendar(initialDateRecallerAtom);

   return (
      <>
         <CalendarAccordian calendars={calendars} />
         <ButtonWrapper
            skipSubmit={skipSubmit}
            submitWithDates={submitWithDates}
            isLoading={isLoading}
         />
      </>
   );
};

export default CalendarWrapper;
