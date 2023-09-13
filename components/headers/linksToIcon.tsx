import { ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import { Icons } from '../icons/headerIcons';
import { Subsection } from './mobile/mobileHeader';

interface LinkProps {
   iconsProp: Icons;
   url: string;
   openSubsection: boolean;
   children: React.ReactNode;
}

const IconLink = ({ iconsProp, url, openSubsection, children }: LinkProps) => {
   const { name, href, icon: Icon } = iconsProp;

   const getHomeRef = (name: string, href: string) => {
      return name.toLocaleLowerCase() === 'home' ? href : url + href;
   };

   const CategorySection = (
      <div className='flex justify-between items-center cursor-pointer'>
         <div className='flex items-center'>
            <Icon />
            {name}
            {children}
         </div>
         <ChevronRightIcon className={`h-6 w-6 transform ${openSubsection ? 'rotate-90' : ''}`} />
      </div>
   );

   const OtherSection = (
      <Link href={`${getHomeRef(name, href)}`} passHref>
         <a className='flex items-center'>
            <Icon />
            {name}
         </a>
      </Link>
   );

   return (
      // <Link href='profile/[id]' as={`${href}`} passHref>
      //    <a className='flex flex-row font-tertiary tracking-widest text-slate-800 dark:text-slate-100'>
      //       <Icon />
      //       {name} {children}
      //    </a>
      // </Link>
      <div>{name === 'Categories' ? CategorySection : OtherSection}</div>
   );
};

export default IconLink;
