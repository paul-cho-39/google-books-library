import React, { Fragment, useState } from 'react';
import { Menu, Dialog, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import { Close, MenuBars } from '../../icons/openCloseIcons';
import IconLink from '../linksToIcon';
import IsSession from '../../Login/isSession';
import IconProviders from '../../icons/headerIcons';
import getUserId from '../../../lib/helper/getUserId';

import useDarkMode from '../../../lib/hooks/useDarkMode';
import { ThemeToggler } from '../../buttons/themeToggler';
import { NavigationProps } from '../../../lib/types/theme';

export const MobileNavigation = ({
   user,
   userId,
   icons,
   darkTheme,
   url,
   signOut,
}: NavigationProps) => {
   return (
      <>
         {/* off canvas menu for mobile */}
         {/* menu opener */}
         <Menu as='div' role='dialog' className='relative inset-0 z-40' aria-modal='true'>
            <Menu.Button className='z-40 relative p-3 ml-2 focus:outline-none focus:ring-1 focus-visible:ring-slate-200 focus-visible:ring-opacity-75 rounded-full'>
               {({ open }) => (
                  <>
                     <span className='sr-only'>{!open ? 'Close menu' : 'Open menu'}</span>
                     {open ? <Close className='h-8 w-8' /> : <MenuBars className='h-8 w-8' />}
                  </>
               )}
            </Menu.Button>
            <Transition as='div'>
               <div className='fixed inset-0 flex bg-gray-200/40 bg-opacity-30'>
                  <Transition.Child
                     enter='transition ease-in duration-150 transform'
                     enterFrom='opacity-0 -translate-x-10'
                     enterTo='opacity-100 translate-x-0'
                     leave='transition ease-in duration-150 transform'
                     leaveFrom='transform opacity-100 translate-x-20'
                     leaveTo='transform opacity-0 -translate-x-10'
                  >
                     <div className='relative z-50 bg-[#F5E6C4] flex h-full w-96 max-w-sm flex-1 flex-col bg- focus:outline-none dark:bg-dark-charcoal'>
                        <div className='pt-5 pb-4'>
                           <Menu.Items
                              as='nav'
                              aria-label='Navigation-bar'
                              className='mb-4 mt-12 py-4 w-full h-full'
                           >
                              <div className='space-y-4 pr-3'>
                                 {/* pass props here */}
                                 {Object.values(icons).map((icon) => (
                                    <Menu.Item key={icon.name}>
                                       {({ active }) => (
                                          <button
                                             role='link'
                                             className={`${
                                                active
                                                   ? 'bg-orange-200 text-slate-800 dark:bg-slate-100/10'
                                                   : 'text-gray-900'
                                             } group flex w-full items-center rounded-md px-8 py-6 text-lg`}
                                          >
                                             {active ? (
                                                <IconLink
                                                   Icon={icon.icon}
                                                   href={
                                                      icon.name === 'Home'
                                                         ? icon.href
                                                         : url + icon.href
                                                   }
                                                >
                                                   {icon.name}
                                                </IconLink>
                                             ) : (
                                                <IconLink
                                                   Icon={icon.icon}
                                                   href={
                                                      icon.name === 'Home'
                                                         ? icon.href
                                                         : url + icon.href
                                                   }
                                                >
                                                   {icon.name}
                                                </IconLink>
                                             )}
                                          </button>
                                       )}
                                    </Menu.Item>
                                 ))}
                                 <span className='mb-2 block border-b-2 border-slate-200'></span>
                                 {/* most likely move the logic to pass to a component */}
                                 <div className='flex flex-col items-center justify-center gap-y-6 overflow-hidden md:gap-y-5'>
                                    {!user ? (
                                       <IsSession
                                          className='py-2'
                                          name='sign in'
                                          href='/auth/signin'
                                       />
                                    ) : (
                                       <IsSession
                                          className='py-2'
                                          name='Sign out'
                                          signOut={signOut}
                                       />
                                    )}
                                    <ThemeToggler
                                       className='h-10 w-10'
                                       theme={darkTheme.theme}
                                       setTheme={darkTheme.setTheme}
                                    />
                                 </div>
                              </div>
                           </Menu.Items>
                        </div>
                     </div>
                  </Transition.Child>
               </div>
            </Transition>
         </Menu>
      </>
   );
};
