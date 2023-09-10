import Link from 'next/link';
import { Categories } from '../../constants/categories';
import { capitalizeWords } from '../../lib/utils/transformChar';
import SingleOrMultipleAuthors from '../bookcover/authors';
import BookDescription from '../bookcover/description';
import styles from './../../styles/Home.module.css';

import { ArrowRightIcon } from '@heroicons/react/20/solid';

// TEST THIS ONE
type BookSection = 'Best Seller' | 'Recommended';
type CategoryHeaderParams = BookSection & Categories;

type CategoryDescriptionParams = {
   id: string;
   title: string;
   subtitle?: string;
   authors?: string[];
   publishedYear?: string;
   description?: string;
};

interface CategoryDisplayProps {
   category: CategoryHeaderParams;
   children: React.ReactNode;
   forwardRef?: React.RefObject<HTMLDivElement>;
}

export const CategoryDisplay = ({ category, children, forwardRef }: CategoryDisplayProps) => {
   return (
      <article id={category}>
         <CategoryHeader category={category} />
         <div className='px-1 py-1 rounded-md lg:px-2 lg:py-2'>
            <div
               ref={forwardRef}
               className='relative scollbars flex justify-start space-x-4 lg:space-x-0 lg:grid lg:grid-cols-6'
            >
               {children}
            </div>
            <div className='text-right -my-6'>
               <ShowMoreCategory category={category} />
            </div>
         </div>
      </article>
   );
};

export const CategoryDescription = ({
   id,
   title,
   subtitle,
   authors,
   publishedYear,
   description,
}: CategoryDescriptionParams) => {
   return (
      <div className='px-2 py-2 bg-beige overflow-hidden dark:bg-dark-charcoal'>
         <div className='w-full h-full flex flex-col px-2 bg-white dark:bg-slate-900'>
            <div className='flex flex-col'>
               <div className='w-full'>
                  <h3 className='text-md font-medium py-1 text-slate-800 dark:text-slate-100'>
                     <Link as={`/books/${id}`} href={'/books/[slug]/'} passHref>
                        <a className='line-clamp-2 text-ellipsis'>
                           <span className='sr-only'>
                              {title}: {subtitle}
                           </span>
                           {subtitle ? title + ': ' + subtitle : title}
                        </a>
                     </Link>
                  </h3>

                  {/* another component for reusability */}
                  {/* in the props 'dmy' 'y' 'my' */}
               </div>

               {/* another component for reusability */}
               <div className='block overflow-hidden dark:text-slate-100'>
                  <h3 className='text-xs py-1 text-clip space-x-0.5 not-first:text-blue-700 not-first:hover:text-slate-300 '>
                     <span className=''>by</span>
                     {!authors ? 'Unknown author' : <SingleOrMultipleAuthors authors={authors} />}
                  </h3>
                  <h4 className='text-xs pb-1'>Published: {publishedYear}</h4>
               </div>
            </div>
            <div className='w-full h-full overflow-hidden'>
               <BookDescription
                  isLink
                  passHref
                  as={`/books/${id}`}
                  href={'/books/[slug]/'}
                  description={description}
                  descriptionLimit={250}
                  lineClamp='line-clamp-4'
                  className='text-xs overflow-hidden'
               />
            </div>
         </div>
      </div>
   );
};

const CategoryHeader = ({ category }: { category: CategoryHeaderParams }) => {
   return (
      <h2 className='mt-4 py-3 text-xl lg:text-2xl text-slate-800 dark:text-slate-100'>
         {capitalizeWords(category)}
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
         <a
            className='cursor-pointer inline-flex text-sm overflow-auto'
            // className='flex flex-row items-center justify-end text-md after:contents-["..."] text-slate-800 dark:text-slate-100'
         >
            <span>More {category} books...</span>
         </a>
      </Link>
   );
};
