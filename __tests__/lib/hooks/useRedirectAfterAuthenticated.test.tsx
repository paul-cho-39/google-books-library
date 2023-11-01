import { render } from '@testing-library/react';
import * as nextAuth from 'next-auth/react';
import { useRouter } from 'next/router';

import useRedirectIfAuthenticated from '@/lib/hooks/useRedirectAfterAuthenticated';

jest.mock('next-auth/react');
jest.mock('next/router', () => ({
   __esModule: true,
   useRouter: jest.fn(),
}));

const nextAuthMocked = nextAuth as jest.Mocked<typeof nextAuth>;

const REDIRECT_TO = '/home';

function TestComponent({ redirectTo }: { redirectTo?: string }) {
   useRedirectIfAuthenticated(redirectTo);
   return null;
}

describe('useRedirectIfAuthenticated', () => {
   const mockPush = jest.fn();
   const mockBack = jest.fn();
   beforeEach(() => {
      (useRouter as jest.Mock).mockReturnValue({
         push: mockPush,
         back: mockBack,
      });
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('redirects to given path when authenticated and redirectTo is provided', () => {
      (nextAuthMocked.useSession as jest.Mock).mockReturnValue({
         data: { user: { name: 'user' } },
         status: 'authenticated',
      });

      render(<TestComponent redirectTo={REDIRECT_TO} />);
      expect(mockPush).toHaveBeenCalledWith(REDIRECT_TO);
      expect(mockBack).not.toHaveBeenCalled();
   });

   it('calls router.back() when authenticated and redirectTo is not provided', () => {
      (nextAuthMocked.useSession as jest.Mock).mockReturnValue({
         data: { user: { name: 'user' } },
         status: 'authenticated',
      });

      render(<TestComponent redirectTo='' />);
      expect(mockBack).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
   });

   it('does not redirect if not authenticated', () => {
      (nextAuthMocked.useSession as jest.Mock).mockReturnValue({
         data: null,
         status: 'unauthenticated',
      });

      render(<TestComponent />);
      expect(mockPush).not.toHaveBeenCalled();
      expect(mockBack).not.toHaveBeenCalled();
   });
});
