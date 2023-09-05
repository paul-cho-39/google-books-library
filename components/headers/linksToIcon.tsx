import Link from 'next/link';

interface LinkProps {
   name?: string;
   children: React.ReactNode;
   href: string;
   Icon: () => JSX.Element;
}

const IconLink = ({ href, name, Icon, children }: LinkProps) => {
   // pass the icons in here
   return (
      <Link href='profile/[id]' as={`${href}`} passHref>
         <a className='flex flex-row font-tertiary tracking-widest text-slate-800 dark:text-slate-100'>
            <Icon />
            {name} {children}
         </a>
      </Link>
   );
};

export default IconLink;
