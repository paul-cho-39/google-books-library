import Link from 'next/link';
import { capitalizeWords, formatCategoryName } from '../../../utils/transformChar';
import CategoryLayout, { CategoryLayoutProps } from '../../layout/page/categoryLayout';
import { CategoryHeaderParams } from '../../../constants/categories';
import classNames from 'classnames';

export const CategoryDisplay = ({ category, children, forwardRef }: CategoryLayoutProps) => {
   return (
      <CategoryLayout
         className='scollbars w-[175vw] lg:w-full lg:overflow-hidden'
         category={category}
      >
         <CategoryHeader className='mb-4' category={category} />
         <div
            ref={forwardRef}
            className='relative lg:grid lg:grid-cols-6'
            // className='relative scollbars grid grid-cols-3 lg:grid lg:grid-cols-6'
         >
            {children}
         </div>
         <div className='text-left bg-fixed lg:px-4 lg:text-right'>
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
         <a className='cursor-pointer inline-flex text-sm hover:opacity-80 hover:underline hover:underline-offset-1 hover:decoration-orange-400 dark:hover:decoration-orange-200'>
            <span className='dark:text-slate-200'>
               More {capitalizeWords(category as string)} books...
            </span>
         </a>
      </Link>
   );
};
