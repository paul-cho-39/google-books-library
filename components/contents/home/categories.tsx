import Link from 'next/link';
import { capitalizeWords, formatCategoryName } from '../../../utils/transformChar';
import CategoryLayout, { CategoryLayoutProps } from '../../layout/page/categoryLayout';
import { CategoryHeaderParams } from '../../../constants/categories';
import classNames from 'classnames';

export const CategoryDisplay = ({ category, children, forwardRef }: CategoryLayoutProps) => {
   return (
      <CategoryLayout category={category}>
         <CategoryHeader className='' category={category} />
         <div
            ref={forwardRef}
            className='relative scollbars grid grid-cols-3 lg:grid lg:grid-cols-6'
         >
            {children}
         </div>
         <div className='text-right'>
            <ShowMoreCategory category={category} />
         </div>
      </CategoryLayout>
   );
};

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
         as={`/categories/${category}`}
         href={'/categories/[slug]'}
         passHref
      >
         <a className='cursor-pointer inline-flex text-sm hover:opacity-80 hover:underline hover:underline-offset-1 hover:decoration-orange-600 dark:hover:decoration-orange-300 transition-none'>
            <span className='dark:text-slate-100'>
               More {capitalizeWords(category as string)} books...
            </span>
         </a>
      </Link>
   );
};
