import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import SignupField from '@/components/inputs/signupForm';
import Signup from 'pages/auth/signup';
import { FormInput } from '@/lib/types/forms';

describe('<SignupField />', () => {
   const mockProps = {
      register: jest.fn(),
      name: 'email' as keyof FormInput,
      label: 'email',
      type: 'email',
   };

   it('renders the correct label based on the name property', () => {
      render(<SignupField {...mockProps} error={undefined} />);

      const labelElement = screen.getByLabelText('email*');
      expect(labelElement).toBeInTheDocument();
   });

   it('should display error when there is an error', () => {
      const mockError = { type: 'email', message: 'This field is required' };
      render(<SignupField error={mockError} {...mockProps} />);

      const errorElement = screen.getByRole('alert');
      expect(errorElement).toHaveTextContent('This field is required');
   });

   it('should not display error when there is no error', () => {
      render(<SignupField error={undefined} {...mockProps} />);

      const errorElement = screen.queryByRole('alert');
      expect(errorElement).toBeNull();
   });
});
