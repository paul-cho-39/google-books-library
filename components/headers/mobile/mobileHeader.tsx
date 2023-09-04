import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import { Menu, Dialog, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import { Close, MenuBars } from '../../icons/openCloseIcons';
import IconLink from '../linksToIcon';
import IsSession from '../../Login/isSession';
import IconProviders from '../../icons/headerIcons';
import getUserId from '../../../lib/helper/getUserId';

import useDarkMode from '../../../lib/hooks/useDarkMode';
import classNames from 'classnames';
import { CloseButton } from 'react-bootstrap';

const MobileNavigation = () => {
   const { data: user, status } = useSession();
   const { theme, setTheme } = useDarkMode();

   const [isOpen, setOpen] = useState(false);
   const [icons] = useState(IconProviders);

   // TODO // turn this into a function and into a class that returns a url?
   const userId = user && getUserId(user as object, 'id');
   const url = '/profile/' + userId;

   // append the beginning of href with [id]?
   console.log('is it open? ', isOpen);

   return (
      <div className='flex h-16 w-full mb-5 lg:hidden bg-slate-100 dark:bg-slate-800'>
         {/* off canvas menu for mobile */}
         {/* menu opener */}
         <Menu as='div' role='dialog' className='relative inset-0 z-40' aria-modal='true'>
            <Menu.Button
               //  onClick={() => setOpen(!isOpen)}
               className='z-50 relative p-3 ml-2 focus:outline-none focus:ring-1 focus-visible:ring-slate-200 focus-visible:ring-opacity-75 rounded-full'
            >
               {({ open }) => (
                  <>
                     <span className='sr-only'>{!open ? 'Close menu' : 'Open menu'}</span>
                     {open ? <Close className='h-8 w-8' /> : <MenuBars className='h-8 w-8' />}
                     <div className='absolute z-50 top-60 left-48'>
                        It is: {open ? 'open' : 'closed'}
                     </div>
                  </>
               )}
            </Menu.Button>
            <Transition as='div'>
               {/* <div className='fixed inset-0 bg-gray-200/40' /> */}

               <div className='fixed inset-0 flex bg-gray-200/40 bg-opacity-30'>
                  {/* closing button not showing up as of now? */}
                  <Transition.Child
                     enter='transition ease-in duration-150 transform'
                     enterFrom='opacity-0 -translate-x-10'
                     enterTo='opacity-100 translate-x-0'
                     leave='transition ease-in duration-150 transform'
                     leaveFrom='transform opacity-100 translate-x-20'
                     leaveTo='transform opacity-0 -translate-x-10'
                  >
                     <div className='relative bg-slate-100 flex h-full w-96 max-w-sm flex-1 flex-col bg- focus:outline-none dark:slate-800'>
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
                                             // change the color
                                             className={`${
                                                active
                                                   ? 'bg-indigo-100 text-slate-800'
                                                   : 'text-gray-900'
                                             } group flex w-full items-center rounded-md px-8 py-6 text-lg`}
                                          >
                                             {/* figure out WHERE and HOW to implement session here */}
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
                                 <div className='flex flex-col gap-y-2 overflow-hidden md:gap-y-5 bg-orange-500'>
                                    <div
                                       role='button'
                                       className='inline-flex justify-center items-center '
                                    >
                                       {!user ? (
                                          <div aria-label='Sign in' className='flex'>
                                             <IsSession name='Sign in' href='/auth/signin' />
                                          </div>
                                       ) : (
                                          <IsSession name='Sign out' signOut={signOut} />
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </Menu.Items>
                        </div>
                     </div>
                  </Transition.Child>
               </div>
            </Transition>
         </Menu>
      </div>
   );
};

export default MobileNavigation;
