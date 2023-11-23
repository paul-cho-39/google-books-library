import { signOut, useSession } from 'next-auth/react';
import useDarkMode from '@/lib/hooks/useDarkMode';
import { useEffect, useRef, useState } from 'react';
import IconProviders from '../icons/headerIcons';
import getUserId from '@/lib/helper/getUserId';
import { LargeNavigation } from './largeNavbar';
import { MobileNavigation } from './mobile/mobileHeader';
import SideNavigation, { SideNavigationProps } from './sidebar';
import SideBarPortal from '../modal/portal';

const Navigation = ({ sidebarOpen, setSidebarOpen }: SideNavigationProps) => {
   const { data: user } = useSession();
   const darkTheme = useDarkMode();
   const [icons] = useState(IconProviders);
   const userId = user && getUserId(user as object, 'id');
   const url = '/profile/' + userId;

   // const [isSidebarOpen, setSidebarOpen] = useState(false);

   const navProps = {
      darkTheme,
      signOut,
      icons,
      userId,
      url,
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
