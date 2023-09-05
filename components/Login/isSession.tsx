import { SignOutParams } from 'next-auth/react';
import Link from 'next/link';
import clsx from 'clsx';

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
         className={clsx('text-blue-700 text-lg dark:text-blue-300', className)}
      >
         <Link href={href ?? '/auth/signin'}>{name}</Link>
      </button>
   );
};

export default IsSession;
