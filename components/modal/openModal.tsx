import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';

interface ModalProps {
   isOpen: boolean;
   setIsOpen: Dispatch<SetStateAction<boolean>>;
   DialogTitle: string;
   children: React.ReactNode;
}

export default function ModalOpener({ isOpen, setIsOpen, DialogTitle, children }: ModalProps) {
   function closeModal() {
      setIsOpen(false);
   }

   return (
      <Transition appear show={isOpen} as={Fragment}>
         {/* maybe set z-highest z-higher z-high */}
         <Dialog as='div' className='relative z-50 dark:bg-slate-700' onClose={closeModal}>
            <Transition.Child
               as={Fragment}
               enter='ease-out duration-300'
               enterFrom='opacity-0'
               enterTo='opacity-100'
               leave='ease-in duration-200'
               leaveFrom='opacity-100'
               leaveTo='opacity-0'
            >
               <div className='fixed inset-0 bg-black bg-opacity-25' />
            </Transition.Child>
            <div className='fixed inset-0 overflow-y-auto'>
               <div className='flex min-h-full items-center justify-center p-4 text-center'>
                  <Transition.Child
                     as={Fragment}
                     enter='ease-out duration-300'
                     enterFrom='opacity-0 scale-95'
                     enterTo='opacity-100 scale-100'
                     leave='ease-in duration-200'
                     leaveFrom='opacity-100 scale-100'
                     leaveTo='opacity-0 scale-95'
                  >
                     <Dialog.Panel className='overflow-y-hidden w-full h-auto max-w-md transform rounded-2xl bg-white dark:bg-slate-500 p-6 text-left align-middle shadow-xl transition-all'>
                        <Dialog.Title
                           as='h3'
                           className='text-lg font-medium leading-6 text-gray-900 dark:text-gray-200'
                        >
                           {DialogTitle}
                        </Dialog.Title>
                        <div className='mt-14 dark:text-gray-300'>{children}</div>
                     </Dialog.Panel>
                  </Transition.Child>
               </div>
            </div>
         </Dialog>
      </Transition>
   );
}
