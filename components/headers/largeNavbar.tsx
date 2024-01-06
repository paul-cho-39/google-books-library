import Link from 'next/link';
import { ThemeToggler } from '../buttons/themeToggler';
import IsSession from '../login/isSession';
import { NavigationProps } from '@/lib/types/theme';
import SearchInput from '../inputs/search';
import HomeIcon from '../icons/homeIcon';
import ROUTES from '@/utils/routes';
import UserProfile from '../login/userProfile';

export const LargeNavigation = ({
   user,
   userId,
   icons,
   darkTheme,
   // url,
   signOut,
}: NavigationProps) => {
   return (
      <>
         <div className='flex items-center w-full h-full px-8'>
            {/* Home Link */}
            <HomeIcon />
            <div className='h-full flex justify-center items-center w-[450px]'>
               <SearchInput />
            </div>

            {/* maybe here it will be the profile so clickable with profile related (?) */}
            <div className='flex items-center ml-auto space-x-6'>
               {!user ? (
                  <IsSession
                     name='Sign In'
                     href={ROUTES.AUTH.SIGNIN}
                     className='text-lg text-dark-brown dark:text-white'
                  />
               ) : (
                  // <IsSession
                  //    name='Sign Out'
                  //    signOut={signOut}
                  //    className='text-lg text-dark-brown dark:text-soft-white'
                  // />
                  <UserProfile name={user.user?.name} userId={userId as string} signOut={signOut} />
               )}
               <ThemeToggler
                  className='h-10 w-10'
                  theme={darkTheme.theme}
                  setTheme={darkTheme.setTheme}
               />
            </div>
         </div>
      </>
   );
};
