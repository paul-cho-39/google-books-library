import { PrimitiveAtom, useAtomValue } from 'jotai';
import YearCalendar from './year';
import DayCalendar from './day';
import MonthCalendar from './month';
import { getDay, getMonth, getYear, InitialDateRecallerProps } from '@/lib/store/atomDates';

// return with hooks
export const useInitialCalendar = (
   initialDateRecallerAtom: PrimitiveAtom<InitialDateRecallerProps>
) => {
   const isKnown = useAtomValue(initialDateRecallerAtom);
   const day = useAtomValue(getDay);
   const month = useAtomValue(getMonth);
   const year = useAtomValue(getYear);
   return {
      year: {
         id: 1,
         Component: YearCalendar,
         name: `Year: ${year > 0 ? year : ''}`,
         isKnown: isKnown.year,
      },
      month: {
         id: 2,
         Component: MonthCalendar,
         name: `Month: ${month >= 0 ? month + 1 : ''}`,
         isKnown: isKnown.month,
      },
      day: {
         id: 3,
         Component: DayCalendar,
         name: `Day: ${day > 0 ? day : ''}`,
         isKnown: isKnown.day,
      },
   };
};
