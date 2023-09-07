import Link from 'next/link';
import { Categories } from '../../constants/categories';
import { capitalizeWords } from '../../lib/utils/transformChar';
import SingleOrMultipleAuthors from '../bookcover/authors';
import BookImage from '../bookcover/bookImages';
import BookDescription from '../bookcover/description';

interface CategoryDisplayProps {
   category: CategoryHeaderParams;
   children: React.ReactNode;
}

export const CategoryDisplay = ({ category, children }: CategoryDisplayProps) => {
   // expandable -- if it takes too long dont do it
   return (
      <article id={category}>
         <CategoryHeader category={category} />
         <div className='px-4 py-4 bg-red-500'>
            {/* map over the images here */}
            <div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-x-6'>
               {children}
            </div>
         </div>
      </article>
   );
};

type BookSection = 'Best Seller' | 'Recommended';
type CategoryHeaderParams = BookSection & Categories;
export const CategoryHeader = ({ category }: { category: CategoryHeaderParams }) => {
   return (
      <h2 className='py-4 text-xl lg:text-2xl text-slate-800 dark:text-slate-100'>
         {capitalizeWords(category)}
      </h2>
   );
};

// TEST THIS ONE
type CategoryDescriptionParams = {
   id: string;
   title: string;
   subtitle?: string;
   authors?: string[];
   publishedYear?: string;
   description?: string;
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
      <div className='flex flex-col'>
         <div className='bg-yellow-500 flex flex-col py-2 px-2'>
            <div className='w-full overflow-hidden'>
               <h3 className='text-lg py-2 font-medium text-slate-800 dark:text-slate-100 lg:text-2xlg lg:py-3'>
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
               <h4>Published: {publishedYear}</h4>
            </div>

            {/* another component for reusability */}
            <div>
               <h3 className='w-full text-sm text-clip space-x-0.5 not-first:text-blue-700 not-first:hover:text-blue-500 '>
                  <span className=''>by{': '}</span>
                  {!authors ? 'Unknown author' : <SingleOrMultipleAuthors authors={authors} />}
                  <span className='sr-only'>{authors}</span>
               </h3>
            </div>
         </div>

         {/* another component for reusability */}
         <BookDescription description={description} />
      </div>
   );
};

// ** For images use book cards **
