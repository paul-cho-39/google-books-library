import { Fragment, useState } from 'react';
import { Menu, Dialog, Transition, Disclosure } from '@headlessui/react';
import { Close, MenuBars } from '../../icons/openCloseIcons';
import Link from 'next/link';

import { ChevronUpIcon } from '@heroicons/react/20/solid';

import IsSession from '../../Login/isSession';
import IconLink from '../linksToIcon';
import { ThemeToggler } from '../../buttons/themeToggler';
import { NavigationProps } from '@/lib/types/theme';
import { IconProps, Icons, Navigation } from '../../icons/headerIcons';
import SearchInput from '../../inputs/search';
import ROUTES from '@/utils/routes';

export const MobileNavigation = ({ user, userId, icons, darkTheme, signOut }: NavigationProps) => {
   return (
      <div className='flex items-center justify-between md:justify-start bg-beige dark:bg-charcoal'>
         {/* off canvas menu for mobile */}
         {/* menu opener */}
         <Menu
            as={'div'}
            role='dialog'
            className='relative inline-flex items-center justify-center md:flex-shrink z-40 dark:bg-charcoal'
            aria-modal='true'
         >
            {({ close }) => (
               <>
                  {/* <Menu.Button className='z-40 relative p-3 ml-2 focus:outline-none focus:ring-1 focus-visible:ring-slate-200 focus-visible:ring-opacity-75 rounded-full'> */}
                  <Menu.Button className='z-40 p-3 relative focus:outline-none focus:ring-1 focus-visible:ring-slate-200 focus-visible:ring-opacity-75 rounded-full'>
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
                           {/* can create a separate component here too for readability and maintainability */}

                           <div className='relative z-40 bg-dilutedbeige flex h-full w-96 max-w-sm flex-1 flex-col overflow-y-scroll focus:outline-none dark:bg-dark-charcoal'>
                              <div className='pt-5 pb-4'>
                                 <Menu.Items
                                    as='nav'
                                    aria-label='Navigation-bar'
                                    className='mb-4 mt-12 py-4 w-full h-full'
                                 >
                                    <div className='space-y-4 pr-3 overflow-y-auto'>
                                       <Section icons={icons} userId={userId} close={close} />
                                       <span className='mb-2 block border-b-2 border-slate-200'></span>
                                       {/* below the section */}
                                       <div className='flex flex-col items-center justify-center gap-y-6 overflow-hidden md:gap-y-5'>
                                          {!user ? (
                                             <IsSession
                                                className='py-2'
                                                name='Sign In'
                                                href='/auth/signin'
                                                close={close}
                                             />
                                          ) : (
                                             <IsSession
                                                className='py-2'
                                                name='Sign out'
                                                signOut={signOut}
                                                close={close}
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
               </>
            )}
         </Menu>
         {/* <div className='relative top-0 left-[10%] p-1 max-w-xs w-full md:max-w-sm'> */}
         <div className='md:px-14 md:justify-end'>
            <SearchInput />
         </div>
      </div>
   );
};

interface SessionProps {
   subsections: Navigation[];
   close: () => void;
}

const Section = ({
   icons,
   userId,
   close,
}: {
   icons: Partial<IconProps>;
   userId: string | null;
   close: () => void;
}) => {
   return (
      <>
         {Object.values(icons).map((icon) => {
            const isCategory = icon.name.toLowerCase() === 'categories';
            return isCategory ? (
               <DisclosureItem
                  userId={userId as string}
                  key={icon.name}
                  icon={icon}
                  subsections={icons['categories']?.subsection || []}
                  close={close}
               />
            ) : (
               <MenuItemButton key={icon.name} icon={icon} userId={userId} close={close} />
            );
         })}
      </>
   );
};

// section for 'categories' that can be expanded
const Subsection = ({ subsections, close }: SessionProps) => {
   const handleClose = () => {
      console.log('closing');

      setTimeout(() => {
         close();
      }, 300);
   };

   return (
      <>
         <ul
            aria-label='book categories link list'
            role='list'
            className='flex flex-col items-center justify-center w-full h-full'
         >
            {subsections.map((section) => (
               <li className='py-[6px] bg-transparent' key={section.name}>
                  <Link
                     passHref
                     as={ROUTES.CATEGORIES(section.name?.toLocaleLowerCase() as string)}
                     href={'/categories/[slug]'}
                  >
                     <a onClick={handleClose}>{section.name}</a>
                  </Link>
               </li>
            ))}
         </ul>
      </>
   );
};

// section for categories
const DisclosureItem = ({
   icon,
   userId,
   subsections,
   close,
}: {
   icon: Icons;
   userId: string;
   subsections: any;
   close: () => void;
}) => {
   return (
      <Disclosure>
         {({ open }) => (
            <>
               <Disclosure.Button className='group flex w-full items-center rounded-md px-8 py-6 text-lg dark:text-slate-100'>
                  <IconLink userId={userId} iconsProp={icon} close={close} />
                  <ChevronUpIcon
                     className={`${
                        open ? 'rotate-180 transform' : ''
                     } h-6 w-6 dark:slate-200 transition-all duration-200 ease-linear`}
                  />
               </Disclosure.Button>
               <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-slate-700 dark:text-slate-100'>
                  <Subsection subsections={subsections} close={close} />
               </Disclosure.Panel>
            </>
         )}
      </Disclosure>
   );
};

// section for 'profile' and 'home'
// any additional navigations should be added here
const MenuItemButton = ({
   icon,
   userId,
   close,
}: {
   icon: Icons;
   userId: string | null;
   close: () => void;
}) => {
   return (
      <Menu.Item>
         <button
            role='link'
            className='group flex w-full items-center rounded-md px-8 py-6 text-lg text-slate-700 dark:text-slate-100'
         >
            <IconLink userId={userId} iconsProp={icon} close={close} />
         </button>
      </Menu.Item>
   );
};
