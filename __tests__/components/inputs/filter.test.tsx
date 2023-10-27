import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import FilterInput from '@/components/inputs/filter';
import { FilterProps } from '@/lib/types/googleBookTypes';

const mockFilter: FilterProps = {
   filterBy: 'all',
   filterParams: 'None',
};

describe('<FilterInput />', () => {
   it('renders the component correctly', () => {
      render(<FilterInput filter={mockFilter} setFilter={jest.fn()} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
   });

   it('renders expanded dropdown by default', () => {
      render(<FilterInput filter={mockFilter} setFilter={jest.fn()} />);

      expect(screen.getByLabelText('Filter By:')).toBeVisible();
      expect(screen.getByLabelText('Filter Availability:')).toBeVisible();
   });

   it('toggles the filtered visibility on click', () => {
      render(<FilterInput filter={mockFilter} setFilter={jest.fn()} />);

      fireEvent.click(screen.getByRole('button'));
      expect(screen.queryByLabelText('Filter By:')).toBeNull();
      expect(screen.queryByLabelText('Filter Availability:')).toBeNull();

      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByLabelText('Filter By:')).toBeVisible();
      expect(screen.getByLabelText('Filter Availability:')).toBeVisible();
   });

   it('updates the filter state on change', () => {
      const setFilterMock = jest.fn();
      render(<FilterInput filter={mockFilter} setFilter={setFilterMock} />);

      //   fireEvent.click(screen.getByText('Filter'));
      fireEvent.change(screen.getByLabelText('Filter By:'), { target: { value: 'title' } });

      expect(setFilterMock).toHaveBeenCalledWith(
         expect.objectContaining({ filterBy: 'title', filterParams: 'None' })
      );

      fireEvent.change(screen.getByLabelText('Filter Availability:'), {
         target: { value: 'partial' },
      });
      expect(setFilterMock).toHaveBeenCalledWith(
         expect.objectContaining({ filterBy: 'all', filterParams: 'partial' })
      );
   });
});
