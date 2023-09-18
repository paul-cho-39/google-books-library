import Link from 'next/link';
import { Categories } from '../../constants/categories';
import { capitalizeWords, formatCategoryName } from '../../utils/transformChar';

type BookSection = 'Best Seller' | 'Recommended';
type CategoryHeaderParams = BookSection | Categories;

interface CategoryDisplayProps {
   category: CategoryHeaderParams;
   children: React.ReactNode;
   // forwardRef?: (el: HTMLDivElement) => void;
   forwardRef?: React.RefObject<HTMLDivElement>;
}

export const CategoryDisplay = ({ category, children, forwardRef }: CategoryDisplayProps) => {
   return (
      <article id={category as string}>
         <CategoryHeader category={category} />
         <div className='px-1 py-1 rounded-md lg:px-2 lg:py-2'>
            <div
               ref={forwardRef}
               className='relative scollbars flex justify-start space-x-4 lg:space-x-0 lg:grid lg:grid-cols-6'
            >
               {children}
            </div>
            <div className='text-right'>
               <ShowMoreCategory category={category} />
            </div>
         </div>
      </article>
   );
};

const CategoryHeader = ({ category }: { category: CategoryHeaderParams }) => {
   const formattedCategory = formatCategoryName(category as string);
   return (
      <h2 className='mt-4 py-3 text-xl lg:text-2xl text-slate-800 dark:text-slate-100'>
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
