import { ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import { Icons, NavigationParams } from '../icons/headerIcons';

type ProfileIcon = (id: string) => string;
type MobileNavigationSection = Record<NavigationParams, React.ReactNode>;
interface LinkProps {
   iconsProp: Icons;
   // url: string;
   userId: string | null;
   children?: React.ReactNode;
}

const IconLink = ({ iconsProp, userId, children }: LinkProps) => {
   const { name, href, icon: Icon } = iconsProp;
   const profileHref = href as ProfileIcon;
   const nameLowerCase = name.toLocaleLowerCase() as NavigationParams;

   // when adding navigation that requires users add it here
   const getProfileHref = () => {
      return name.toLocaleLowerCase() === 'profile'
         ? profileHref(userId as string)
         : (href as string);
   };

   const CategorySection = (
      <div className='flex justify-between items-center cursor-pointer'>
         <div className='flex items-center'>
            <Icon />
            {name}
         </div>
      </div>
   );

   const HomeSection = (
      <Link href={`${getProfileHref()}`} passHref>
         <a className='flex items-center'>
            <Icon />
            {name}
         </a>
      </Link>
   );

   const UserRequiredSection = !userId ? null : (
      <Link href={`${getProfileHref()}`} passHref>
         <a className='flex items-center'>
            <Icon />
            {name}
         </a>
      </Link>
   );

   const navigationMapper: MobileNavigationSection = {
      categories: CategorySection,
      home: HomeSection,
      profile: UserRequiredSection,
   };

   // return <div>{name === 'Categories' ? CategorySection : OtherSection}</div>;
   return <div>{navigationMapper[nameLowerCase]}</div>;
};

export default IconLink;
