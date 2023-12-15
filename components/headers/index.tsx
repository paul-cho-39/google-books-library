import { signOut, useSession } from 'next-auth/react';
import useDarkMode from '@/lib/hooks/useDarkMode';
import { useEffect, useRef, useState } from 'react';
import IconProviders from '../icons/headerIcons';
import getUserId from '@/lib/helper/getUserId';
import { LargeNavigation } from './largeNavbar';
import { MobileNavigation } from './mobile/mobileHeader';
import SideNavigation, { SideNavigationProps } from './sidebar';
import SideBarPortal from '../modal/portal';
import filterIcons from '@/lib/helper/filterIcons';

const Navigation = ({ sidebarOpen, setSidebarOpen }: SideNavigationProps) => {
   const { data: user } = useSession();
   const darkTheme = useDarkMode();
   const userId = user && getUserId(user as object, 'id');
   const [icons, setIcons] = useState(() => filterIcons(IconProviders, userId));

   useEffect(() => {
      setIcons(filterIcons(IconProviders, userId));
   }, [userId]);

   const navProps = {
      darkTheme,
      signOut,
      icons,
      userId,
      user,
   };

   return (
      <header>
         <div className='hidden lg:flex h-16 w-full bg-beige dark:bg-charcoal'>
            <LargeNavigation {...navProps} />
            <SideBarPortal sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
         </div>
         <div className='flex h-16 w-full lg:hidden bg-beige dark:bg-charcoal'>
            <MobileNavigation {...navProps} />
         </div>
      </header>
   );
};

export default Navigation;
