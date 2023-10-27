import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { NextRouter, useRouter } from 'next/router';

import SearchInput from '@/components/inputs/search';

jest.mock('next/router', () => ({
   useRouter: jest.fn(),
}));

describe('<SearchInput />', () => {
   let mockRouter: Partial<NextRouter>;

   // initialize the mock router before each test
   beforeEach(() => {
      mockRouter = {
         push: jest.fn(),
         isReady: false,
      };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
   });

   it('renders correctly', () => {
      render(<SearchInput />);
      expect(screen.getByRole('search')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Search books')).toBeInTheDocument();
   });

   it('renders the initial input correctly as disabled', () => {
      render(<SearchInput />);
      const input = screen.getByRole('button');
      expect(input).toBeDisabled();
   });

   it('updates the correct input value', () => {
      render(<SearchInput />);
      const input = screen.getByPlaceholderText('Search books');
      fireEvent.change(input, { target: { value: 'Fiction' } });
      expect(screen.getByDisplayValue('Fiction')).toBeInTheDocument();
   });

   it('does not submit the form with an empty query', () => {
      render(<SearchInput />);

      mockRouter.isReady = true;

      const input = screen.getByPlaceholderText('Search books');
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.submit(screen.getByRole('search'));

      // it wont push and stay on the current page
      expect(mockRouter.push).not.toHaveBeenCalled();
   });

   it('redirects to the expected search URL when the form is submitted', () => {
      render(<SearchInput />);
      const input = screen.getByPlaceholderText('Search books');
      fireEvent.change(input, { target: { value: 'Fiction' } });

      // mocking router is ready
      mockRouter.isReady = true;

      const form = screen.getByRole('search');
      fireEvent.submit(form);

      expect(mockRouter.push).toHaveBeenCalledWith('/search?q=Fiction');
   });
});
