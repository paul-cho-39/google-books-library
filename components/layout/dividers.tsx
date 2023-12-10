import { PlusIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import Spinner from '../loaders/spinner';
import { topCategories } from '@/constants/categories';

type DividerButtonsProps = {
   title: string;
   numberToLoad: number;
   isLoading?: boolean;
   renderIcon?: JSX.Element;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Divider = () => {
   return (
      <div role='separator' className='relative flex justify-center'>
         <div className='absolute border-t-[1.5px] border-gray-600 dark:border-gray-200 w-full' />
      </div>
   );
};

export const DividerButtons = ({
   title,
   numberToLoad,
   isLoading,
   renderIcon,
   ...props
}: DividerButtonsProps) => {
   const totalLoad = topCategories.length;

   // if the number to load surpasses then it should not be displayed
   if (numberToLoad >= totalLoad) {
      return null;
   }

   return (
      <div className='relative w-full md:max-w-2xl lg:max-w-4xl my-6 lg:my-10'>
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
               {isLoading ? (
                  <Spinner />
               ) : (
                  <PlusIcon
                     className='-ml-1 -mr-0.5 h-5 w-5 text-slate-800 dark:text-slate-400'
                     aria-hidden='true'
                  />
               )}
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
