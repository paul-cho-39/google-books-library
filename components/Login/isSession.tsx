import { SignOutParams } from 'next-auth/react';
import Link from 'next/link';
import clsx from 'clsx';
import ROUTES from '@/utils/routes';
import { useRouter } from 'next/router';
import useAuthHandlers from '@/lib/hooks/useAuthHandlers';

type SessionProps = {
   name: string;
   href?: string;
   close?: () => void;
   signOut?: () => void;
   // handleSignOut?: (isCredential: boolean) => Promise<void>
   className?: string;
};

const IsSession = ({ name, href, signOut, close, className }: SessionProps) => {
   // const route = useRouter();
   // const handleClick = () => {
   //    signOut && signOut();

   //    setTimeout(() => {
   //       route.push('/');
   //       close && close();
   //    }, 200);
   // };

   return (
      <>
         {signOut ? (
            <button
               role='button'
               aria-label={name.charAt(0).toUpperCase()}
               onClick={signOut}
               className={clsx(
                  'text-blue-700 text-lg dark:text-blue-300 focus:outline-none focus:ring-1 focus-visible:ring-slate-200 focus-visible:ring-opacity-75',
                  className
               )}
            >
               {name}
            </button>
         ) : (
            <Link href={href ?? ROUTES.AUTH.SIGNIN}>
               <span className='text-blue-400 dark:text-blue-300 cursor-pointer'>{name}</span>
            </Link>
         )}
      </>
   );
};

export default IsSession;
