import { SignOutParams } from 'next-auth/react';
import Link from 'next/link';

type SessionProps = {
   name: string;
   href?: string;
   signOut?: () => void;
};

const IsSession = ({ name, href, signOut }: SessionProps) => {
   return (
      <button
         role='button'
         aria-label={name.charAt(0).toUpperCase()}
         onClick={signOut}
         className='text-white text-lg relative left-8'
      >
         <Link href={href ?? '/auth/signin'}>{name}</Link>
      </button>
   );
};

export default IsSession;
