import { ReactIconProps } from './headerIcons';
import clsx from 'clsx';

export const Close = ({ className, ...props }: ReactIconProps) => {
   return (
      <svg
         className={clsx('text-slate-800 dark:text-slate-100', className)}
         xmlns='http://www.w3.org/2000/svg'
         fill='none'
         viewBox='0 0 24 24'
         stroke-width='1.5'
         stroke='currentColor'
         aria-hidden='true'
         {...props}
      >
         <path stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' />
      </svg>
   );
};

export const MenuBars = ({ className, ...props }: ReactIconProps) => {
   return (
      <svg
         className={clsx('text-slate-800 dark:text-slate-100', className)}
         xmlns='http://www.w3.org/2000/svg'
         fill='none'
         viewBox='0 0 24 24'
         stroke-width='1.5'
         stroke='currentColor'
         aria-hidden='true'
         {...props}
      >
         <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
         />
      </svg>
   );
};
