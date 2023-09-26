import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import AddPrimary, { ButtonProps } from '../currentReadingButton';
import WantReadButton from '../wantReadButton';
import RemovePrimary from '../removeCurrent';
import DeleteButton from '../deleteButton';
import DeleteButtonWrapper from '../deleteButtonWrapper';

const allButtons = [
   {
      name: 'reading',
      component: AddPrimary,
   },
   {
      name: 'wanttoread',
      component: WantReadButton,
   },
   {
      name: 'removeCurrentlyReading',
      component: RemovePrimary,
   },
];

function PopOverButtons({ userId, book }: ButtonProps) {
   const [isHidden, setIsHidden] = useState(false);
   const [isClosed] = useState(true);

   const toggleHide = () => {
      setIsHidden((prev) => !prev);
   };

   const handleClick = () => {
      setIsHidden(false);
   };

   return (
      <>
         <Popover className='relative'>
            {({ open, close }) => (
               <>
                  <Popover.Button
                     onClick={handleClick}
                     className={`
                ${open ? 'ring-black ring-2' : 'text-opacity-90'}
                -top-[1.25rem] relative inline-flex items-center rounded-r-2xl border border-slate-400 bg-white dark:bg-slate-700 px-2 py-2 text-sm font-medium text-gray-500 dark:text-slate-200 hover:bg-gray-50 focus:z-10 focus:border-black focus:outline-none focus:ring-1 focus:ring-black`}
                  >
                     <ChevronDownIcon
                        className='h-5 w-5 text-violet-200 hover:text-violet-100 dark:text-slate-200'
                        aria-hidden='true'
                     />
                  </Popover.Button>
                  <Transition show={open}>
                     <Transition.Child
                        as={Fragment}
                        enter='transition origin-top ease-out duration-500'
                        enterFrom='opacity-0 translate-y-5'
                        enterTo='opacity-100 translate-y-0'
                        leave='transition ease-in duration-400'
                        leaveFrom='opacity-100 translate-y-0'
                        leaveTo='opactiy-0 translate-y-5 duration-250'
                     >
                        <Popover.Panel className='fixed left-0 w-full h-[14.7rem] bottom-[0%] z-50 border-t-2 bg-zinc-50 border-slate-300'>
                           <div className='w-full'>
                              <div
                                 onClick={() =>
                                    setTimeout(() => {
                                       close();
                                    }, 200)
                                 }
                                 className='w-full inline-flex items-end justify-end px-5'
                              >
                                 <XMarkIcon
                                    height='25'
                                    width='25'
                                    className='mt-3 mb-5 hover:rounded-full hover:ring-2 hover:ring-black'
                                 />
                              </div>
                              <div
                                 aria-hidden={isHidden}
                                 className={`${isHidden ? 'hidden' : 'mt-0'}`}
                              >
                                 <div className='flex flex-col justify-center items-center'>
                                    {allButtons.map((allButton) => (
                                       <div
                                          onClick={() => {
                                             isClosed &&
                                                setTimeout(() => {
                                                   close();
                                                }, 800);
                                          }}
                                          key={allButton.name}
                                       >
                                          <allButton.component userId={userId} book={book} />
                                       </div>
                                    ))}

                                    <DeleteButtonWrapper
                                       userId={userId}
                                       id={book?.id}
                                       toggleHide={toggleHide}
                                    />
                                 </div>
                              </div>
                              {/* is hidden until clicked */}
                              <div
                                 aria-hidden={!isHidden}
                                 className={`${isHidden ? 'mt-4 px-8' : 'hidden'}`}
                              >
                                 <p className='mb-5'>
                                    All data will be lost containing this book. Are you sure you
                                    want to delete the data?
                                 </p>
                                 <div className='flex flex-row justify-evenly items-center'>
                                    <button
                                       className='w-36 items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                       onClick={toggleHide}
                                    >
                                       Go back
                                    </button>
                                    {/* whenever popover closes the state resets to stay hidden*/}
                                    <div
                                       onClick={() => {
                                          isClosed &&
                                             setTimeout(() => {
                                                setIsHidden(false);
                                                close();
                                             }, 800);
                                       }}
                                    >
                                       <DeleteButton book={book} userId={userId} />
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </Popover.Panel>
                     </Transition.Child>
                  </Transition>
               </>
            )}
         </Popover>
      </>
   );
}

export default React.memo(PopOverButtons);
