import { PlusIcon } from '@heroicons/react/20/solid';
import { ButtonHTMLAttributes, ReactNode } from 'react';

export const Divider = () => {
   return (
      <div className='relative flex justify-center'>
         <div className='absolute border-t-[1.5px] border-gray-600 dark:border-gray-200 w-full' />
      </div>
   );
};

type DividerButtonsProps = {
   title: string;
   condition?: boolean;
   renderIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const DividerButtons = ({ title, condition, renderIcon, ...props }: DividerButtonsProps) => {
   const displayIcon = () => {
      if (condition) {
         return renderIcon;
      }
      return (
         <PlusIcon
            className='-ml-1 -mr-0.5 h-5 w-5 text-slate-800 dark:text-slate-200'
            aria-hidden='true'
         />
      );
   };
   return (
      <div className='relative'>
         <div className='absolute inset-0 flex items-center' aria-hidden='true'>
            <div className='w-full border-t border-gray-600 dark:border-gray-200' />
         </div>
         <div className='relative flex justify-center'>
            <button
               {...props}
               type='button'
               className='inline-flex items-center gap-x-1.5 rounded-full bg-beige px-3 py-1.5 text-sm font-semibold text-slate-900 dark:text-slate-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            >
               {title}
               {displayIcon()}
            </button>
         </div>
      </div>
   );
};
