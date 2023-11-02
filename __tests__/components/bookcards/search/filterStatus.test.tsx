import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import FilterStatus from '@/components/bookcards/search/filterStatus';
import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import { Library } from '@/lib/types/models/books';

// jest.mock('@/lib/helper/books/isBooksInLibrary', () => ({
//    isBookInData: jest.fn(),
// }));

describe('<FilterStatus />', () => {
   const libraryStates: Library = {
      finished: ['b1', 'b2', 'b3'],
      reading: ['b2', 'b4', 'b6'],
      want: ['b3', 'b5', 'b6'],
      unfinished: [],
   };

   it('renders the finished reading status when the book is in the finished array', () => {
      const bookId = 'b1';

      render(<FilterStatus bookId={bookId} library={libraryStates} />);

      expect(screen.getByText('Finished reading')).toBeInTheDocument();
   });
   it('renders the finished reading status when the book is in both finished and reading array', () => {
      const bookId = 'b2';

      render(<FilterStatus bookId={bookId} library={libraryStates} />);

      expect(screen.getByText('Finished reading')).toBeInTheDocument();
   });

   it('renders the finished reading status when the book is in both finished and want to read array', () => {
      const bookId = 'b3';

      render(<FilterStatus bookId={bookId} library={libraryStates} />);

      expect(screen.getByText('Finished reading')).toBeInTheDocument();
   });

   it('renders the reading status when the book is in the reading array', () => {
      const bookId = 'b4';

      render(<FilterStatus bookId={bookId} library={libraryStates} />);

      expect(screen.getByText('Currently reading')).toBeInTheDocument();
   });

   it('renders the reading reading status when the book is in both reading and want to read array', () => {
      const bookId = 'b6';

      render(<FilterStatus bookId={bookId} library={libraryStates} />);

      expect(screen.getByText('Currently reading')).toBeInTheDocument();
   });

   it('renders nothing when the book is not in the library', () => {
      const bookId = 'b6';

      const { container } = render(<FilterStatus bookId={bookId} library={undefined} />);

      expect(container).toBeEmptyDOMElement();
   });
});
