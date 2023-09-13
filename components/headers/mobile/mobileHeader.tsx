import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Menu, Dialog, Transition, Disclosure } from '@headlessui/react';
import { Close, MenuBars } from '../../icons/openCloseIcons';
import IconLink from '../linksToIcon';
import IsSession from '../../Login/isSession';
import { ThemeToggler } from '../../buttons/themeToggler';
import { NavigationProps } from '../../../lib/types/theme';
import { IconProps, Navigation } from '../../icons/headerIcons';
import Link from 'next/link';
import { ChevronRightIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';

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
         <Menu as='div' role='dialog' className='relative bg-beige inset-0 z-40' aria-modal='true'>
            <Menu.Button className='z-40 relative p-3 ml-2 focus:outline-none focus:ring-1 focus-visible:ring-slate-200 focus-visible:ring-opacity-75 rounded-full'>
               {({ open }) => (
                  <>
                     <span className='sr-only'>{!open ? 'Close menu' : 'Open menu'}</span>
                     {open ? <Close className='h-8 w-8' /> : <MenuBars className='h-8 w-8' />}
                  </>
               )}
            </Menu.Button>
            <Transition appear as='div'>
               <div className='fixed inset-0 flex bg-gray-200/40 bg-opacity-30'>
                  <Transition.Child
                     enter='transition ease-in duration-150 transform'
                     enterFrom='opacity-0 -translate-x-10'
                     enterTo='opacity-100 translate-x-0'
                     leave='transition ease-in duration-150 transform'
                     leaveFrom='transform opacity-100 translate-x-20'
                     leaveTo='transform opacity-0 -translate-x-10'
                  >
                     <div className='relative z-50 bg-dilutedbeige flex h-full w-96 max-w-sm flex-1 flex-col bg- focus:outline-none dark:bg-dark-charcoal'>
                        <div className='pt-5 pb-4'>
                           <Menu.Items
                              as='nav'
                              aria-label='Navigation-bar'
                              className='mb-4 mt-12 py-4 w-full h-full'
                           >
                              <div className='space-y-4 pr-3 bg-blue-100 overflow-y-auto'>
                                 <Section icons={icons} url={url} />
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

interface SessionProps {
   subsections: Navigation[];
}

const Section = ({ url, icons }: { url: string; icons: IconProps }) => {
   const [openSubsection, setOpenSubsection] = useState(false);
   // use ref to open it up then?
   const handleSubsection = (name: string) => {
      if (name === 'Categories') {
         setOpenSubsection(!openSubsection);
      }
   };

   return (
      <>
         {Object.values(icons).map((icon) => {
            if (icon.name.toLowerCase() === 'categories') {
               return (
                  <Disclosure key={icon.name}>
                     {({ open }) => (
                        <>
                           <Disclosure.Button className='group flex w-full items-center rounded-md px-8 py-6 text-lg'>
                              <IconLink url={url} iconsProp={icon} />
                              <ChevronUpIcon
                                 className={`${
                                    open ? 'rotate-180 transform' : ''
                                 } h-6 w-6 dark:slate-200 transition-all duration-200 ease-linear`}
                              />
                           </Disclosure.Button>
                           <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500'>
                              <Subsection subsections={icons['categories'].subsection || []} />
                           </Disclosure.Panel>
                        </>
                     )}
                  </Disclosure>
               );
            } else {
               return (
                  <Menu.Item key={icon.name}>
                     <button
                        role='link'
                        className={classNames(
                           'group flex w-full items-center rounded-md px-8 py-6 text-lg'
                        )}
                     >
                        <IconLink url={url} iconsProp={icon} />
                     </button>
                  </Menu.Item>
               );
            }
         })}
      </>
   );
};

export const Subsection = ({ subsections }: SessionProps) => {
   return (
      <>
         <ul
            aria-label='book categories link list'
            role='list'
            className='flex flex-col items-center justify-center w-full h-full'
         >
            {subsections.map((section) => (
               <>
                  <li key={section.name}>
                     <Link passHref href={'/'}>
                        <a>{section.name}</a>
                     </Link>
                  </li>
               </>
            ))}
         </ul>
      </>
   );
};
