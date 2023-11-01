import { PlusIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type DividerButtonsProps = {
   title: string;
   condition?: boolean;
   renderIcon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Divider = () => {
   return (
      <div role='separator' className='relative flex justify-center'>
         <div className='absolute border-t-[1.5px] border-gray-600 dark:border-gray-200 w-full' />
      </div>
   );
};

export const DividerButtons = ({ title, condition, renderIcon, ...props }: DividerButtonsProps) => {
   const displayIcon = () => {
      if (condition) {
         return renderIcon;
      }
      return (
         <PlusIcon
            className='-ml-1 -mr-0.5 h-5 w-5 text-slate-800 dark:text-slate-400'
            aria-hidden='true'
         />
      );
   };

   return (
      <div className='relative w-full md:max-w-2xl lg:max-w-4xl'>
         <div className='absolute inset-0 flex items-center' aria-hidden='true'>
            <div className='w-full border-t border-gray-600 dark:border-gray-200' />
         </div>
         <div className='relative flex justify-center'>
            <button
               {...props}
               type='button'
               aria-label='Load more books'
               className='inline-flex items-center gap-x-1 rounded-full bg-beige dark:bg-gray-200 px-3 py-1.5 text-sm font-semibold text-slate-900 dark:text-slate-400 shadow-sm hover:bg-gray-50 focus:ring-1 focus:ring-black'
            >
               {title}
               {displayIcon()}
            </button>
         </div>
      </div>
   );
};

export const LabelDivider = ({ label, className }: { label: string; className?: string }) => {
   // it has to be same as the backgorund color
   // likely wont change but here for reference
   const platformBG = 'bg-white dark:bg-slate-800';
   return (
      <div role='separator' className='relative'>
         <div className='absolute inset-0 flex items-center' aria-hidden='true'>
            <div className='w-full border-t border-gray-300' />
         </div>
         <div className='relative flex justify-center'>
            <span
               className={classNames(platformBG, 'px-2 text-sm dark:text-slate-200 text-slate-800')}
            >
               {label}
            </span>
         </div>
      </div>
   );
};
