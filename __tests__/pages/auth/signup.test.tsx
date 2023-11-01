import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import * as nextAuth from 'next-auth/react';

import apiRequest from '@/utils/fetchData';
import Signup from '@/pages/auth/signup';
import { Users } from '@/lib/types/providers';

jest.mock('@/utils/fetchData', () =>
   // will pass the test every time it is submitted for its simplicity
   jest.fn().mockResolvedValue({ success: true })
);

jest.mock('@/models/server/prisma/Users', () => ({
   findAllUsersEmailAndUsername: jest.fn(),
}));

jest.mock('next-auth/react');

const nextAuthReactMocked = nextAuth as jest.Mocked<typeof nextAuth>;

describe('<Signup />', () => {
   let mockProps: Users[] = [];

   // this test will be tested inside the hook
   nextAuthReactMocked.useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
   });

   it('should not submit if no username or email is provided', async () => {
      render(<Signup emailAndUsername={mockProps} />);

      fireEvent.click(screen.getByRole('button'));

      await waitFor(async () => {
         const alerts = await screen.findAllByRole('alert');

         expect(screen.getByRole('button')).toBeDisabled();
         expect(alerts.length).toBe(3);
         expect(nextAuth.signIn).not.toHaveBeenCalled();
         expect(apiRequest).not.toHaveBeenCalled();
      });
   });

   it('renders the input correctly', () => {
      render(<Signup emailAndUsername={mockProps} />);

      fireEvent.input(screen.getByLabelText('Username'), {
         target: { value: 'test' },
      });

      fireEvent.input(screen.getByLabelText('Email'), {
         target: { value: 'test1@mail.com' },
      });

      fireEvent.input(screen.getByLabelText('Password'), {
         target: { value: 'password' },
      });

      expect(screen.getByLabelText('Email')).toHaveValue('test1@mail.com');
      expect(screen.getByLabelText('Username')).toHaveValue('test');
      expect(screen.getByLabelText('Password')).toHaveValue('password');
   });

   it('should not submit if email is already in use', async () => {
      mockProps = [
         { username: 'test1', email: 'test1@mail.com' },
         { username: 'test2', email: 'test2@mail.com' },
      ];
      render(<Signup emailAndUsername={mockProps} />);

      // should be okay
      fireEvent.input(screen.getByLabelText('Username'), {
         target: { value: 'test' },
      });

      fireEvent.input(screen.getByLabelText('Email'), {
         target: { value: 'test1@mail.com' },
      });

      fireEvent.input(screen.getByLabelText('Password'), {
         target: { value: 'password' },
      });

      fireEvent.click(screen.getByRole('button', { name: /create an account/i }));

      await waitFor(() => {
         expect(screen.getByRole('alert')).toBeInTheDocument();
         expect(screen.getByRole('alert')).toHaveTextContent('Email is not available');
         expect(screen.getByRole('button', { name: /create an account/i })).toBeDisabled();
         expect(nextAuth.signIn).not.toHaveBeenCalled();
      });
   });

   it('should not display error when values are valid and automatically sign in', async () => {
      mockProps = [
         { username: 'test1', email: 'test1@mail.com' },
         { username: 'test2', email: 'test2@mail.com' },
      ];
      render(<Signup emailAndUsername={mockProps} />);

      fireEvent.input(screen.getByLabelText('Username'), {
         target: { value: 'test' },
      });

      fireEvent.input(screen.getByLabelText('Email'), {
         target: { value: 'workingtest@mail.com' },
      });

      fireEvent.input(screen.getByLabelText('Password'), {
         target: { value: 'password' },
      });

      fireEvent.submit(screen.getByText('Create an Account'));

      await waitFor(() => {
         expect(screen.queryAllByRole('alert')).toHaveLength(0);
         expect(apiRequest).toHaveBeenCalledTimes(1);
         expect(nextAuth.signIn).toHaveBeenCalledTimes(1);
      });
   });
});

// Alright, let's write the test for <Account /> component that I shared.

// If you require code, let me know, but it should already be shared from the previous conversation.
// Here are some tests to run:

// 1) if there is no inputs and it is submitted, it should expect length of two alerts
// 1a) the alerts should have 'Password is incorrect' and 'Email is incorrect'
// 1b) it should not expect it 'signIn', which is using next-auth/react, to have been called

// 2) mock the response where the returned value from 'res' status 'ok' is false, it should have an alert length of 1
// 2a) the alert text should be: 'Email or password is invalid'
// 2b) 'signIn' should have been called

// 3) it should contain auth providers with
// 3a) aria-label={google-login-button} and {facebook-login-button}
// 3b) if one of these buttons are clicked, it should call 'signIn'

// 4) mock the response where the status is 'ok' is true
// 4a) the 'signIn' should be called
// 4b) call router.push()
