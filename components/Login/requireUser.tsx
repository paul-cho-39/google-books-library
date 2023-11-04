import { useRouter } from 'next/router';
import classNames from 'classnames';
import { Suspense, useEffect, useRef } from 'react';
import { ButtonSkeleton } from '../loaders/bookcardsSkeleton';
import ROUTES from '@/utils/routes';

interface SignInRequiredButtonProps {
   // type: 'finished' | 'popover';
   signedInActiveButton: JSX.Element;
   title?: string;
   userId?: string | null;
   className?: string;
   children?: React.ReactNode;
}

const SignInRequiredButton = ({
   // type,
   userId,
   title,
   className,
   children,
   signedInActiveButton,
}: SignInRequiredButtonProps) => {
   const isReady = useRef<boolean>();
   const router = useRouter();

   const handlePress = () => {
      console.log('router asPath is: ', router.asPath);
      isReady && router.push(ROUTES.AUTH.SIGNIN_NEXT(router.asPath));
   };

   useEffect(() => {
      if (!router.isReady) return;
      isReady.current = true;
   }, [router.isReady]);

   return userId ? (
      signedInActiveButton
   ) : (
      <button
         aria-label={'Sign in required'}
         onClick={handlePress}
         className={classNames(className)}
      >
         {title || children}
      </button>
   );
};

export default SignInRequiredButton;
