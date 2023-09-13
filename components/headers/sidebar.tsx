import { Transition, Dialog } from '@headlessui/react';
import { Categories, categories } from '../../constants/categories';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import {
   ArrowLeftOnRectangleIcon,
   ArrowRightOnRectangleIcon,
   ViewColumnsIcon,
} from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { capitalizeWords } from '../../utils/transformChar';
import { useScrollDirection } from '../../lib/hooks/useScrollDirection';

export interface SideNavigationProps {
   sidebarOpen: boolean;
   setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

interface Navigation {
   name?: string;
   href?: string;
   current?: boolean;
}

function getNavigation(categories: readonly string[]): Navigation[] {
   return categories.map((category) => ({
      name: category,
      href: category,
      current: false,
   }));
}

const SideNavigation = ({ sidebarOpen, setSidebarOpen }: SideNavigationProps) => {
   // TODO: pass categories as a prop
   const navigation = getNavigation(categories);
   const { isTop } = useScrollDirection();

   // setCurrent(category)
   return (
      <>
         <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
               static
               as='div'
               className='hidden lg:fixed lg:inset-y-0 lg:z-0 lg:flex lg:w-80 lg:flex-col'
               onClose={() => setSidebarOpen(true)}
            >
               <Transition.Child
                  as={Fragment}
                  enter='transition ease-in-out duration-300 transform'
                  enterFrom='-translate-x-full'
                  enterTo='translate-x-0'
                  leave='transition ease-in-out duration-300 transform'
                  leaveFrom='translate-x-0'
                  leaveTo='-translate-x-full'
               >
                  <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-beige px-6 pb-4 dark:bg-charcoal'>
                     <div className='flex h-16 shrink-0 items-center justify-end'>
                        <button type='button' onClick={() => setSidebarOpen(false)}>
                           <span className='sr-only'>Close sidebar</span>
                           <ArrowLeftOnRectangleIcon
                              role='button'
                              aria-label='Close sidebar navigation'
                              className='inline h-6 cursor-pointer dark:stroke-slate-300'
                           />
                        </button>
                     </div>
                     <nav className='flex flex-1 flex-col'>
                        <CategoryHeader />
                        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                           <li>
                              <ul role='list' className='-mx-2 space-y-1'>
                                 {navigation.map((item) => (
                                    <li key={item.name}>
                                       <a
                                          href={item.href}
                                          className={classNames(
                                             item.current
                                                ? 'bg-gray-50  dark:text-slate-100 dark:bg-slate-700'
                                                : 'text-gray-700 hover:text-indigo-200 hover:bg-gray-50 dark:hover:bg-slate-600',
                                             'group flex gap-x-3 rounded-md p-2 text-md leading-6 font-semibold'
                                          )}
                                       >
                                          {capitalizeWords(item.name as string)}
                                       </a>
                                    </li>
                                 ))}
                              </ul>
                           </li>
                        </ul>
                     </nav>
                  </div>
               </Transition.Child>
            </Dialog>
         </Transition.Root>
         <div
            className={classNames(
               sidebarOpen ? 'opacity-0' : 'opacity-100',
               isTop ? 'top-16' : 'top-0',
               'fixed z-40 h-16 inline-flex items-center left-10 transition-opacity duration-150 ease-out'
            )}
         >
            <button type='button' onClick={() => setSidebarOpen(true)}>
               <span className='sr-only'>Close sidebar</span>
               <ArrowRightOnRectangleIcon
                  role='button'
                  aria-label='Close sidebar navigation'
                  className='inline h-6 cursor-pointer dark:stroke-slate-300'
               />
            </button>
         </div>
      </>
   );
};

const CategoryHeader = () => {
   return (
      <h3 className='inline-flex items-center text-xl text-center capitalize pb-4 dark:text-slate-200'>
         <ViewColumnsIcon className='h-5 w-5 dark:text-slate-200' />
         <span className='px-2'>categories</span>
      </h3>
   );
};

export default SideNavigation;
