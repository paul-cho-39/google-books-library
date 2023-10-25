import { SignOutParams } from 'next-auth/react';
import Link from 'next/link';
import clsx from 'clsx';
import ROUTES from '@/utils/routes';

type SessionProps = {
   name: string;
   href?: string;
   signOut?: () => void;
   className?: string;
};

const IsSession = ({ name, href, signOut, className }: SessionProps) => {
   return (
      <button
         role='button'
         aria-label={name.charAt(0).toUpperCase()}
         onClick={signOut}
         className={clsx(
            'text-blue-700 text-lg dark:text-blue-300 focus:outline-none focus:ring-1 focus-visible:ring-slate-200 focus-visible:ring-opacity-75',
            className
         )}
      >
         <Link href={href ?? ROUTES.AUTH.SIGNIN}>{name}</Link>
      </button>
   );
};

export default IsSession;
