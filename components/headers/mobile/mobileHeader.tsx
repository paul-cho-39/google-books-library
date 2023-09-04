import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import React, { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Close, MenuBars } from '../../icons/openCloseIcons';
import IconLink from '../linksToIcon';
import IsSession from '../../Login/isSession';
import IconProviders from '../../icons/headerIcons';
import getUserId from '../../../lib/helper/getUserId';

const Header = () => {
   const { data: user, status } = useSession();
   const [icons] = useState(IconProviders);

   // TODO // turn this into a function and into a class that returns a url?
   const userId = user && getUserId(user as object, 'id');
   const url = '/profile/' + userId;

   // append the beginning of href with [id]?
   return (
      <div className='flex h-full w-full mb-5'>
         {/* off canvas menu for mobile */}
         <div className='relative z-40 w-[45vw] h-12 bg-blue-600 lg:hidden'>
            <Menu as='div' className='relative z-40' role='dialog' aria-modal='true'>
               <div>
                  <Menu.Button className='text-white inline-flex mt-2.5 ml-2.5 w-full justify-start hover:bg-opacity-50 focus:outline-none focus-visible:ring-white focus-visible:ring-opacity-75'>
                     <MenuBars />
                  </Menu.Button>
               </div>
               {/* menu opener */}
               <Transition>
                  {/* the background that is NOT the header */}
                  <div className='fixed inset-0 bg-blue-gray-500 bg-opacity-75'></div>
                  {/* button for closing the sidebar */}
                  <Transition.Child
                     enter='transform transition duration-200'
                     enterFrom='opacity-0 rotate-[-120deg] scale-50'
                     enterTo='opacity-100 rotate-0 scale-100'
                     leave='transform duration-200 transition ease-in-out'
                     leaveFrom='opacity-100 rotate-0 scale-100 '
                     leaveTo='opacity-0 scale-95 '
                  >
                     <div className='absolute -top-16 right-2 -mr-12 pt-4'>
                        <button
                           type='button'
                           className='ml-1 flex h-10 w-10 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                        >
                           <span className='sr-only'>Close sidebar</span>
                           <Close />
                        </button>
                     </div>
                  </Transition.Child>
                  <div className='fixed inset-0 z-40 flex'>
                     {/* closing button not showing up as of now? */}
                     <Transition.Child
                        enter='transition ease-in duration-150 transform'
                        enterFrom='opacity-0 -translate-x-10'
                        enterTo='opacity-100 translate-x-0'
                        leave='transition ease-in duration-150 transform'
                        leaveFrom='transform opacity-100 translate-x-0'
                        leaveTo='transform opacity-0 -translate-x-10'
                     >
                        <div className='relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none'>
                           <div className='pt-5 pb-4'>
                              <div className='flex flex-shrink-0 items-center px-4'>
                                 {/* change the image here -- logo here? */}
                                 {/* have this link set to "home" */}
                                 <img
                                    className='h-8 w-auto'
                                    src='https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600'
                                    alt='Your Company'
                                 />
                              </div>
                              <Menu.Items
                                 as='nav'
                                 aria-label='Navigation-bar'
                                 className='mt-5 w-full'
                              >
                                 <span className='mb-2 block border-b-2 border-slate-200'></span>
                                 <div className='space-y-2 pr-3'>
                                    {/* pass props here */}
                                    {Object.values(icons).map((icon) => (
                                       <Menu.Item key={icon.name}>
                                          {({ active }) => (
                                             <button
                                                // change the color
                                                className={`${
                                                   active
                                                      ? 'bg-violet-500 text-white'
                                                      : 'text-gray-900'
                                                } group flex w-full items-center rounded-md px-8 py-6 text-sm`}
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
                                 </div>
                              </Menu.Items>
                           </div>
                        </div>
                     </Transition.Child>
                  </div>
               </Transition>
            </Menu>
         </div>
         {/* Mobile top navigation */}
         <div className='lg:hidden w-full'>
            <div className='flex items-center justify-around h-12 bg-blue-600 py-2 px-4 sm:px-6'>
               <div>
                  {/* logo here change to Image/next */}
                  <img
                     className='h-5 w-auto'
                     src='https://tailwindui.com/img/logos/mark.svg?color=white'
                     alt='Your Company'
                  />
               </div>
               <div className=''>
                  {!user ? (
                     <div className='flex'>
                        <IsSession name='Sign in' href='/auth/signin' />
                        {/* <IsSession name="Sign up" href="/auth/signup" /> */}
                     </div>
                  ) : (
                     <IsSession name='Sign out' signOut={signOut} />
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Header;
