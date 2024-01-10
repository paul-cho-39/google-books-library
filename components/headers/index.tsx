import { signOut, useSession } from 'next-auth/react';
import useDarkMode from '@/lib/hooks/useDarkMode';
import { useEffect, useRef, useState } from 'react';
import IconProviders from '../icons/headerIcons';
import getUserInfo from '@/lib/helper/getUserId';
import { LargeNavigation } from './largeNavbar';
import { MobileNavigation } from './mobile/mobileHeader';
import SideNavigation, { SideNavigationProps } from './sidebar';
import SideBarPortal from '../modal/portal';
import filterIcons from '@/lib/helper/filterIcons';
import useAuthHandlers from '@/lib/hooks/useAuthHandlers';

const Navigation = ({ sidebarOpen, setSidebarOpen }: SideNavigationProps) => {
   const { data: user } = useSession();

   const userInfo = getUserInfo(user);
   console.log('The user url is: ', userInfo);
   const darkTheme = useDarkMode();
   const { handleSignOut, linkToSettings } = useAuthHandlers();

   const { userId, ...info } = userInfo;

   // the icons depend on whether userId is not null
   // specifically, the 'profile' requires userId.
   const [icons, setIcons] = useState(() => filterIcons(IconProviders, userId));

   useEffect(() => {
      setIcons(filterIcons(IconProviders, userId));
   }, [userId]);

   const navProps = {
      darkTheme,
      icons,
      userId,
      userInfo: info,
      handleSignOut,
      linkToSettings,
   };

   return (
      <header>
         <div className='hidden lg:flex h-16 w-full bg-beige dark:bg-charcoal'>
            <LargeNavigation {...navProps} />
            <SideBarPortal sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
         </div>
         <div className='block h-16 w-full lg:hidden bg-beige dark:bg-charcoal'>
            <MobileNavigation {...navProps} />
         </div>
      </header>
   );
};

export default Navigation;
