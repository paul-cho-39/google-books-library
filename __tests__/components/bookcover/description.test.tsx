import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import BookDescription from '@/components/bookcover/description';

jest.mock(
   'next/link',
   () =>
      ({ children }: { children: React.ReactNode }) =>
         children
);

describe('BookDescription component', () => {
   const basicProps = {
      href: '',
   };
   it('renders no description when description is empty or undefined', () => {
      const { getByText } = render(<BookDescription description='' {...basicProps} />);

      expect(getByText('No description provided')).toBeInTheDocument();
   });

   // in the front of the page ./categories inside the container when mouse is hovered
   it('renders "See More" link when isLink prop is true', () => {
      const { getByText } = render(
         <BookDescription {...basicProps} description='Some text here' isLink={true} />
      );
      expect(screen.getByTestId('visible-link')).toBeInTheDocument();
   });

   it('renders "See More" button for longer descriptions', () => {
      const { getByText } = render(
         <BookDescription
            {...basicProps}
            description='This is a very long description that should trigger the see more button.'
            descriptionLimit={10}
         />
      );
      expect(getByText('See More')).toBeInTheDocument();
   });

   it('renders the collapsed description correctly', () => {
      const { getByLabelText, container } = render(
         <BookDescription {...basicProps} description='A short description' />
      );
      expect(getByLabelText('Collapsed book description')).toHaveTextContent('A short description');
      expect(container.querySelector('.absolute')).toBeInTheDocument();
   });

   it('expands the description on "See More" button click', () => {
      const { getByText, getByLabelText } = render(
         <BookDescription
            {...basicProps}
            description='This is a very long description that should trigger the see more button.'
            descriptionLimit={10}
         />
      );
      fireEvent.click(getByText('See More'));
      expect(getByLabelText('Expanded book description')).toHaveTextContent(
         'This is a very long description that should trigger the see more button.'
      );
   });

   // after clicking see more then after clicking tsee less again
   it('collapses the description on "See Less" button click', () => {
      const { getByText, getByLabelText, queryByLabelText } = render(
         <BookDescription
            {...basicProps}
            description='This is a very long description that should trigger the see more button.'
            descriptionLimit={10}
         />
      );
      fireEvent.click(getByText('See More'));
      fireEvent.click(getByText('See Less'));
      expect(queryByLabelText('Expanded book description')).toBeNull();
      expect(getByLabelText('Collapsed book description')).toBeInTheDocument();
   });
});
