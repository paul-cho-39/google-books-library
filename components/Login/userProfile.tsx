import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import UserAvatar from '../icons/avatar';

interface UserProfileProps {
   signOut: () => void;
   toSettings: () => void;
   name?: string | undefined | null;
   href?: string | null;
}

const UserProfile = ({ toSettings, signOut, name, href }: UserProfileProps) => {
   return (
      <Menu as='div'>
         <Menu.Button className='rounded-full inline-flex items-center justify-center focus:outline-none focus:ring p-2'>
            <UserAvatar avatarUrl={href} size={{ height: 30, width: 30 }} />
         </Menu.Button>

         <Menu.Items className='absolute z-[9999] right-8 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-md dark:bg-slate-600 shadow-lg ring-1 ring-black/5 focus:outline-none cursor-pointer'>
            <div className='px-1 py-1 relative'>
               <Menu.Item>
                  {({ active }) => (
                     <button
                        onClick={toSettings}
                        className={`${
                           active
                              ? 'bg-indigo-300 dark:bg-slate-600 text-white dark:text-gray-700'
                              : 'text-gray-900 dark:text-white'
                        } group flex w-full items-center px-2 py-2 text-sm`}
                     >
                        Profile
                        {/* <Link href={ROUTES.PROFILE.SETTINGS(userId)}>Profile</Link> */}
                     </button>
                  )}
               </Menu.Item>
               <Menu.Item>
                  {({ active }) => (
                     <button
                        onClick={signOut}
                        className={classNames(
                           active
                              ? 'bg-indigo-200 dark:bg-slate-600 text-white dark:text-gray-700'
                              : 'text-gray-900 dark:text-white',
                           'group flex w-full items-center px-2 py-2 text-sm text-red-400'
                        )}
                     >
                        Sign Out
                     </button>
                  )}
               </Menu.Item>

               {/* Name or Username or null */}
               {name && (
                  <Menu.Item>
                     <span
                        className={classNames(
                           'group flex w-full items-center px-2 py-2 text-sm border-t-2 border-black dark:border-white text-gray-900 dark:text-white cursor-default'
                        )}
                     >
                        <strong>Welcome {name}!</strong>
                     </span>
                  </Menu.Item>
               )}
            </div>
         </Menu.Items>
      </Menu>
   );
};

export default UserProfile;
