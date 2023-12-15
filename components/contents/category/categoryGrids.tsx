import { forwardRef } from 'react';
import Pagination, { PaginationProps } from '../../headers/pagination';
import CategoryLayout, { CategoryLayoutProps } from '../../layout/page/categoryLayout';
import { CategoryHeader } from '../home/categories';

type CategoryGridLargeParams = CategoryLayoutProps & PaginationProps & {};

export const CategoryGridLarge = forwardRef<React.ElementRef<'div'>, CategoryGridLargeParams>(
   function CategoryGridLarge({ category, children, ...props }, ref) {
      return (
         <CategoryLayout category={category as string}>
            <CategoryHeader className='mb-4 lg:mb-6' category={category} />
            <div
               ref={ref}
               className='relative scrollbarX lg:overflow-hidden grid grid-cols-3 lg:grid-cols-5 grid-rows-3'
            >
               {children}
            </div>
            <Pagination {...props} />
         </CategoryLayout>
      );
   }
);

export const CategoryGridSmall = forwardRef<React.ElementRef<'div'>, CategoryLayoutProps>(
   function CategoryGridSmall({ category, children, ...props }, ref) {
      return (
         <CategoryLayout className='my-4 xl:max-w-5xl' category={category as string}>
            <CategoryHeader className='mb-4 lg:mb-6' category={category} />
            <div ref={ref} className='grid grid-cols-2 lg:grid-cols-3'>
               {children}
            </div>
         </CategoryLayout>
      );
   }
);
