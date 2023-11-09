import { Fragment } from 'react';
import { UserActionButtonProps } from '@/lib/types/models/books';
import { userActionButtons } from '@/utils/userActionButton';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import DeleteButtonWrapper from './wrappers/deleteButtonWrapper';

const MenuButtons = ({ userId, book }: UserActionButtonProps) => {
   return (
      <div className='md:relative lg:relative md:z-50 lg:z-50'>
         <Menu as='div'>
            {({ open, close }) => (
               <>
                  <Menu.Button
                     className={classNames(
                        '-top-[1.25rem] relative inline-flex items-center rounded-r-2xl border border-slate-400 bg-white dark:bg-slate-700 px-2 py-2 text-sm font-medium text-gray-500 dark:text-slate-200 hover:bg-gray-50 focus:z-10 focus:border-black focus:outline-none focus:ring-1 focus:ring-black'
                     )}
                  >
                     <ChevronDownIcon
                        className='h-5 w-5 text-violet-200 hover:text-violet-100 dark:text-slate-200'
                        aria-hidden='true'
                     />
                  </Menu.Button>
                  <Transition
                     as={Fragment}
                     enter='transition ease-out duration-100'
                     enterFrom='transform opacity-0 scale-95'
                     enterTo='transform opacity-100 scale-100'
                     leave='transition ease-in duration-75'
                     leaveFrom='transform opacity-100 scale-100'
                     leaveTo='transform opacity-0 scale-95'
                  >
                     <Menu.Items className='bg-dilutedbeige dark:bg-charcoal absolute right-0 -mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-3xl shadow-lg ring-1 ring-black/5 focus:outline-none'>
                        <div className='px-1 py-1'>
                           {userActionButtons.map((userActionButton) => (
                              <Menu.Item key={userActionButton.name}>
                                 {({ active }) => (
                                    <>
                                       <button
                                          aria-label={userActionButton.name}
                                          className={classNames(
                                             active ? 'bg-slate-200' : 'bg-none',
                                             'group flex w-full items-center rounded-md px-2 py-2'
                                          )}
                                       >
                                          <userActionButton.Component userId={userId} book={book} />
                                       </button>
                                    </>
                                 )}
                              </Menu.Item>
                           ))}
                           <Menu.Item>
                              <DeleteButtonWrapper userId={userId} id={book?.id} />
                           </Menu.Item>
                        </div>
                     </Menu.Items>
                  </Transition>
               </>
            )}
         </Menu>
      </div>
   );
};

export default MenuButtons;
