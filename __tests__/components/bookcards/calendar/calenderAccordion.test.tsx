import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useAtomValue, useUpdateAtom } from 'jotai/utils';

import { CalendarAccordian } from '@/components/bookcards/calendar/calendarAccordion';

// nextAccoridon function is not mocked because it is critical to the integration of
// the component.
jest.mock('jotai/utils', () => ({
   useAtomValue: jest.fn(),
   useUpdateAtom: jest.fn(),
}));

const mockedYear = 'year 2020';
const mockedMonth = 'month 2020';
const mockedDay = 'day 2020';

const MockedDateComponent = ({ date }: { date: string }) => {
   return (
      <div>
         <button>{date}</button>
      </div>
   );
};

const calendars = {
   year: {
      id: 1,
      Component: () => <MockedDateComponent date={mockedYear} />,
      name: 'Year',
      isKnown: true,
   },
   month: {
      id: 2,
      Component: () => <MockedDateComponent date={mockedMonth} />,
      name: 'Month',
      isKnown: true,
   },
   day: {
      id: 3,
      Component: () => <MockedDateComponent date={mockedDay} />,
      name: 'Day',
      isKnown: true,
   },
};

describe('<CalendarAccordian />', () => {
   beforeAll(() => {
      (useAtomValue as jest.Mock).mockReturnValue({
         year: false,
         month: false,
         day: false,
      });
      (useUpdateAtom as jest.Mock).mockImplementation(() => jest.fn());
   });

   it('should initially render the dialog and the contents inside the panel to be null', () => {
      // the month and day calendar should not be there
      render(<CalendarAccordian calendars={calendars} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      expect(screen.getByRole('button', { name: /year/i })).toBeVisible();
      expect(screen.getByRole('button', { name: /month/i })).toBeVisible();
      expect(screen.getByRole('button', { name: /day/i })).toBeVisible();

      expect(screen.queryByText(mockedYear)).toBeNull();
      expect(screen.queryByText(mockedMonth)).toBeNull();
      expect(screen.queryByText(mockedDay)).toBeNull();
   });

   it('should open year content when clicked', () => {
      render(<CalendarAccordian calendars={calendars} />);

      fireEvent.click(screen.getByRole('button', { name: /year/i }));

      expect(screen.queryByText(mockedYear)).toBeVisible();
      expect(screen.queryByText(mockedYear)).not.toBeNull();

      expect(screen.queryByText(mockedMonth)).toBeNull();
      expect(screen.queryByText(mockedDay)).toBeNull();
   });
   it('should open both year content and month content when both are clicked', () => {
      render(<CalendarAccordian calendars={calendars} />);

      fireEvent.click(screen.getByRole('button', { name: /year/i }));
      fireEvent.click(screen.getByRole('button', { name: /month/i }));

      expect(screen.queryByText(mockedYear)).toBeVisible();
      expect(screen.queryByText(mockedMonth)).toBeVisible();

      expect(screen.queryByText(mockedDay)).toBeNull();
   });
   it('should close the year content and open the month content when year content button is clicked', () => {
      const { rerender } = render(<CalendarAccordian calendars={calendars} />);

      fireEvent.click(screen.getByRole('button', { name: /year/i }));
      expect(screen.queryByText(mockedYear)).toBeVisible();

      calendars.year.name = 'Year 2018';
      rerender(<CalendarAccordian calendars={calendars} />);

      expect(screen.queryByText('Year 2018')).toBeVisible();
      // nextAccoridan should automatically click when it rerenders
      expect(screen.queryByText(mockedMonth)).toBeVisible();
      expect(screen.queryByText(mockedDay)).toBeNull();
   });

   it('updates data-index-number attribute correctly', () => {
      render(<CalendarAccordian calendars={calendars} />);

      const yearButton = screen.getByRole('button', { name: /year/i });
      const monthButton = screen.getByRole('button', { name: /month/i });
      const dayButton = screen.getByRole('button', { name: /day/i });

      // opens the accordion
      fireEvent.click(yearButton);
      fireEvent.click(monthButton);
      fireEvent.click(dayButton);

      // after opening the accordion, the data-index-number attribute should equal the calendar's id
      expect(yearButton).toHaveAttribute('data-index-number', '1');
      expect(monthButton).toHaveAttribute('data-index-number', '2');
      expect(dayButton).toHaveAttribute('data-index-number', '3');

      fireEvent.click(yearButton); // Close the accordion
      fireEvent.click(monthButton);
      fireEvent.click(dayButton);

      // after closing the accordion, the data-index-number attribute should be reset to '0'
      expect(yearButton).toHaveAttribute('data-index-number', '0');
      expect(monthButton).toHaveAttribute('data-index-number', '0');
      expect(dayButton).toHaveAttribute('data-index-number', '0');
   });

   // retrieve the value from jotai and see if it matches 'false' after it has been opeend and closed
});
