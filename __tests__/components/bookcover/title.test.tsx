// import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import BookTitle from '@/components/bookcover/title'; // Adjust the import statement according to your file structure
import ROUTES from '@/utils/routes';

describe('BookTitle component', () => {
   const baseProps = {
      id: 'test-id',
      title: 'Test Title',
   };

   it('renders the title correctly', () => {
      render(<BookTitle {...baseProps} />);

      const titles = screen.getByTestId('visible-title');
      expect(titles).toBeInTheDocument();
   });

   it('renders the title with subtitle when subtitle is provided', () => {
      render(<BookTitle {...baseProps} hasLink={false} subtitle='Test Subtitle' />);

      // testing the data-testid here
      // should switch out
      const titles = screen.getByTestId('visible-title');
      expect(titles).toBeInTheDocument();
   });

   it('renders a link when hasLink is true', () => {
      const expectedHref = ROUTES.BOOKS.GOOGLE(baseProps.id);
      render(<BookTitle {...baseProps} hasLink />);

      const linkElement = screen.getByRole('link');
      expect(linkElement).toBeInTheDocument();
   });

   it('does not render a link when hasLink is false', () => {
      render(<BookTitle {...baseProps} hasLink={false} />);

      expect(screen.queryByRole('link')).toBeNull();
   });
});
