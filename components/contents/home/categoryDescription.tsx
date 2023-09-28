import { RouteParams } from '../../../lib/types/routes';
import SingleOrMultipleAuthors from '../../bookcover/authors';
import BookDescription from '../../bookcover/description';
import BookTitle from '../../bookcover/title';

interface CategoryDescriptionParams {
   id: string;
   title: string;
   subtitle?: string;
   authors?: string[];
   publishedYear?: string;
   description?: string;
   routeQuery?: RouteParams;
}

const CategoryDescription = ({
   id,
   title,
   subtitle,
   authors,
   description,
   routeQuery,
}: CategoryDescriptionParams) => {
   return (
      <div className='px-2 py-2 bg-beige overflow-hidden dark:bg-dark-charcoal'>
         <div className='w-full h-full flex flex-col px-2 bg-white dark:bg-slate-900'>
            <div className='flex flex-col'>
               <div className='w-full'>
                  <BookTitle
                     id={id}
                     title={title}
                     subtitle={subtitle}
                     hasLink={false}
                     className='text-md'
                  />
               </div>
               {/* another component for reusability */}
               <div className='block overflow-hidden dark:text-slate-100'>
                  <h3 className='text-xs py-1 text-clip space-x-0.5 '>
                     <span className=''>by</span>
                     <SingleOrMultipleAuthors hoverUnderline authors={authors} />
                  </h3>
               </div>
            </div>
            <div className='w-full h-full overflow-hidden'>
               <BookDescription
                  isLink
                  passHref
                  as={`/books/${id}`}
                  href={{ pathname: '/books/[slug]/', query: routeQuery }}
                  description={description}
                  descriptionLimit={250}
                  lineClamp='line-clamp-4'
                  className='text-xs'
               />
            </div>
         </div>
      </div>
   );
};

export default CategoryDescription;
