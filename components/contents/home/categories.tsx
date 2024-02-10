import Link from 'next/link';

import { capitalizeWords, formatCategoryName } from '@/lib/helper/transformChar';
import CategoryLayout, { CategoryLayoutProps } from '../../layout/page/categoryLayout';
import { CategoryHeaderParams } from '@/constants/categories';
import classNames from 'classnames';
import ROUTES from '@/utils/routes';
import { Fragment, forwardRef } from 'react';
import Spinner from '@/components/loaders/spinner';
import HoveredBookDescription, {
   HoveredBookDescriptionProps,
} from '@/components/bookcover/bookImagesSample';
import { CombinedData } from '@/lib/types/serverTypes';
import BookImage from '@/components/bookcover/bookImages';
import { getBookWidth } from '@/lib/helper/books/getBookWidth';

type CategoryDisplayProps = CategoryLayoutProps & {
   isLoading: boolean;
   isError: boolean;
};


export const CategoryDisplay = forwardRef<React.ElementRef<'div'>, CategoryDisplayProps>(
   function CategoryDisplay({ category, children, isLoading, isError, ...props }, ref) {

      /** TESTING OUT THE COMPONENTS */

      /** TO HERE!! */
      return (
         <CategoryLayout
            category={category}
            className='scrollbarX w-auto lg:w-full lg:overflow-hidden'
         >
            <CategoryHeader className='mb-4' category={category} />
            {/* if there is an error inside the section it will be specific to the section */}
            {isError ? (
               <div className='text-xl lg:text-2x text-black dark:text-slate-300'>
                  Sorry, there is an error fetching the data.
               </div>
            ) : // same with loading here
            isLoading ? (
               <div className='flex items-center justify-center'>
                  <Spinner size='md' color='indigo' />
               </div>
            ) : (
               <>
                  <div ref={ref} className='relative lg:grid lg:grid-cols-6 container'>
                     {children}
                  </div>

                  <div className='text-left bg-fixed lg:px-4 lg:text-right'>
                     <ShowMoreCategory category={category} />
                  </div>
               </>
            )}
         </CategoryLayout>
      );
   }
);

export const CategoryHeader = ({
   category,
   className,
}: {
   category: CategoryHeaderParams;
   className?: string;
}) => {
   const formattedCategory = formatCategoryName(category as string);
   return (
      <h2
         className={classNames(
            className,
            'mt-4 py-3 text-xl lg:text-2xl text-slate-800 dark:text-slate-100'
         )}
      >
         {capitalizeWords(formattedCategory)}
      </h2>
   );
};

const ShowMoreCategory = ({ category }: { category: CategoryHeaderParams }) => {
   return (
      <Link
         aria-label='Show more categories'
         as={ROUTES.CATEGORIES(category as string)}
         href={'/categories/[slug]'}
         passHref
      >
         <a className='cursor-pointer inline-flex text-sm hover:opacity-80 hover:underline hover:underline-offset-1 hover:decoration-orange-400 dark:hover:decoration-orange-200'>
            <span className='dark:text-slate-200'>
               More {capitalizeWords(category as string)} books...
            </span>
         </a>
      </Link>
   );
};
