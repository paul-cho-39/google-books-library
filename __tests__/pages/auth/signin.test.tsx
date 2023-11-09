import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Account from '@/pages/auth/signin';
import * as nextAuth from 'next-auth/react';
import { useRouter } from 'next/router';
import { BuiltInProviderType } from 'next-auth/providers';

const CALLBACK_URL = '/test-url';

jest.mock('next-auth/react');
jest.mock('next/router', () => ({
   __esModule: true,
   useRouter: jest.fn(),
}));

const nextAuthReactMocked = nextAuth as jest.Mocked<typeof nextAuth>;
const signInMock = nextAuth.signIn as jest.MockedFunction<typeof nextAuth.signIn>;

describe('<Account />', () => {
   nextAuthReactMocked.useSession.mockReturnValue({
      data: null,
      update: jest.fn(),
      status: 'unauthenticated',
   });

   const mockedProps: Partial<
      Record<nextAuth.LiteralUnion<BuiltInProviderType, string>, nextAuth.ClientSafeProvider>
   > = {
      google: {
         id: 'google',
         name: 'Google',
         type: 'oauth',
         callbackUrl: CALLBACK_URL,
         signinUrl: '/',
      },
      facebook: {
         id: 'facebook',
         name: 'Facebook',
         type: 'oauth',
         callbackUrl: CALLBACK_URL,
         signinUrl: '/',
      },
   };
   const mockRouter = { push: jest.fn(), query: { next: '/' } };

   // returning the values from getServerSideProps and router to route after successful signin
   beforeEach(() => {
      signInMock.mockReset();
      (useRouter as jest.Mock).mockReturnValue(mockRouter);
      return (
         nextAuth.getProviders as jest.MockedFunction<typeof nextAuth.getProviders>
      ).mockResolvedValue(
         mockedProps as Record<
            nextAuth.LiteralUnion<BuiltInProviderType, string>,
            nextAuth.ClientSafeProvider
         >
      );
   });

   const mockedAuthProviders = [mockedProps.google, mockedProps.facebook];

   it('renders the component inputs correctly', () => {
      render(<Account authProviders={mockedAuthProviders} />);

      fireEvent.input(screen.getByLabelText('Email'), {
         target: { value: 'test1@mail.com' },
      });

      fireEvent.input(screen.getByLabelText('Password'), {
         target: { value: 'password' },
      });

      expect(screen.getByLabelText('Email')).toHaveValue('test1@mail.com');
      expect(screen.getByLabelText('Password')).toHaveValue('password');
   });

   it('should show alerts when inputs are empty and submitted', async () => {
      render(<Account authProviders={mockedAuthProviders} />);

      fireEvent.submit(screen.getByTestId('signin-button'));

      await waitFor(() => {
         fireEvent.submit(screen.getByTestId('signin-button'));
         const alerts = screen.getAllByRole('alert');
         expect(alerts).toHaveLength(3);
         expect(alerts[0].textContent).toBe('');
         expect(alerts[1].textContent).toBe('Email is incorrect');
         expect(alerts[2].textContent).toBe('Password is incorrect');
         expect(signInMock).not.toHaveBeenCalled();
      });
   });

   it('should show an alert when signIn response is not ok', async () => {
      signInMock.mockResolvedValueOnce({ ok: false, status: 401, error: '', url: '' });

      render(<Account authProviders={mockedAuthProviders} />);

      fireEvent.input(screen.getByLabelText('Email'), {
         target: { value: 'test1@mail.com' },
      });
      fireEvent.input(screen.getByLabelText('Password'), {
         target: { value: 'password' },
      });

      fireEvent.submit(screen.getByTestId('signin-button'));

      await waitFor(() => {
         expect(screen.getByRole('alert').textContent).toBe('Email or password is invalid');
         expect(signInMock).toHaveBeenCalledTimes(1);
      });
   });

   it('should contain auth providers and call signIn when clicked', () => {
      render(<Account authProviders={mockedAuthProviders} />);

      const googleButton = screen.getByLabelText('google-login-button');
      const facebookButton = screen.getByLabelText('facebook-login-button');

      fireEvent.click(googleButton);
      expect(signInMock).toHaveBeenCalledWith('google', { callbackUrl: '/' });

      fireEvent.click(facebookButton);
      expect(signInMock).toHaveBeenCalledWith('facebook', { callbackUrl: '/' });
   });

   it('renders the sign in form and allows user to submit', async () => {
      signInMock.mockResolvedValueOnce({ ok: true, status: 200, error: '', url: '' });
      //   const mockRouter = { push: jest.fn() };
      //   (useRouter as jest.Mock).mockReturnValue(mockRouter);

      render(<Account authProviders={mockedAuthProviders} />);

      fireEvent.input(screen.getByLabelText('Email'), {
         target: { value: 'test@mail.com' },
      });
      fireEvent.input(screen.getByLabelText('Password'), {
         target: { value: 'password' },
      });

      fireEvent.submit(screen.getByTestId('signin-button'));

      await waitFor(() => {
         expect(signInMock).toHaveBeenCalledWith('credentials', {
            email: 'test@mail.com',
            password: 'password',
            redirect: false,
         });
         expect(mockRouter.push).toHaveBeenCalled();
      });
   });
});
