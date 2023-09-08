import Link from 'next/link';
import { Categories } from '../../constants/categories';
import { capitalizeWords } from '../../lib/utils/transformChar';
import SingleOrMultipleAuthors from '../bookcover/authors';
import BookImage from '../bookcover/bookImages';
import BookDescription from '../bookcover/description';
import { HEIGHT, getWidth } from '../../pages';

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
   // expandable -- if it takes too long dont do it

   // use ref here

   return (
      <article id={category}>
         <CategoryHeader category={category} />
         <div className='px-2 py-2 rounded-md bg-slate-100'>
            {/* map over the images here */}
            <div
               ref={forwardRef}
               className='relative grid grid-cols-3 gap-x-2 md:grid-cols-4 lg:grid-cols-6'
            >
               {children}
            </div>
         </div>
      </article>
   );
};

export const CategoryHeader = ({ category }: { category: CategoryHeaderParams }) => {
   return (
      <h2 className='py-4 text-xl lg:text-2xl text-slate-800 dark:text-slate-100'>
         {capitalizeWords(category)}
      </h2>
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
      <div className='px-2 py-2 bg-beige overflow-hidden'>
         <div className='w-full h-full flex flex-col px-2 bg-white'>
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
               <div className='block overflow-hidden'>
                  <h3 className='text-xs py-1 text-clip space-x-0.5 not-first:text-blue-700 not-first:hover:text-slate-300'>
                     <span className=''>by</span>
                     {!authors ? 'Unknown author' : <SingleOrMultipleAuthors authors={authors} />}
                  </h3>
                  <h4 className='text-xs pb-1'>Published: {publishedYear}</h4>
               </div>
            </div>
            <div className='w-full h-full overflow-hidden'>
               {/* another component for reusability */}
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

// ** For images use book cards **
