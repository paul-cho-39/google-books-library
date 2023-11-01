import { useLayoutEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const useRedirectIfAuthenticated = (redirectTo?: string) => {
   const { data: session, status } = useSession();
   const router = useRouter();

   useLayoutEffect(() => {
      if (status === 'authenticated') {
         if (!redirectTo) router.back();
         redirectTo && router.push(redirectTo);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [session]);
};

export default useRedirectIfAuthenticated;
