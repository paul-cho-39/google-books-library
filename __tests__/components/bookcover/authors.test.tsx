import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import SingleOrMultipleAuthors from '@/components/bookcover/authors';
import ROUTES from '@/utils/routes';

// testing when theres a single author
describe('<SingleOrMultipleAuthors />', () => {
   it('renders a single author correctly', () => {
      const { getByText } = render(<SingleOrMultipleAuthors authors='John Doe' />);
      expect(getByText('John Doe')).toBeInTheDocument();
   });

   // with text limit
   it('slices a single authors name based on textLimit', () => {
      const author = 'Johnathon Doe';
      const textLimit = 10;
      const expectedText = `${author.slice(0, textLimit)}...`;

      const { getByText } = render(
         <SingleOrMultipleAuthors authors={author} textLimit={textLimit} />
      );
      expect(getByText(expectedText)).toBeInTheDocument();
   });

   // multiple authors
   it('renders multiple authors correctly and limits by indexLimit', () => {
      const authors = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Jones'];
      const { getByText, queryByText } = render(
         <SingleOrMultipleAuthors authors={authors} indexLimit={3} />
      );
      expect(getByText('John Doe')).toBeInTheDocument();
      expect(getByText('Jane Smith')).toBeInTheDocument();
      expect(getByText('Bob Johnson')).toBeInTheDocument();
      // default indexLimit is 3 and so the fourth should be null
      expect(queryByText('Alice Jones')).toBeNull();
   });

   // when theres no author
   it('renders "Unknown author" for empty or undefined authors', () => {
      const { getByText } = render(<SingleOrMultipleAuthors authors={undefined} />);
      expect(getByText('Unknown author')).toBeInTheDocument();
   });
});
