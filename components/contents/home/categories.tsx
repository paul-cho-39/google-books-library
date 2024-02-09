import Link from 'next/link';

import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

// type CategoryDisplayProps = CategoryLayoutProps &
//    HoveredBookDescriptionProps & {
//       isLoading: boolean;
//       isError: boolean;
//       data: CombinedData[];
//    };

// export const CategoryDisplay = forwardRef<React.ElementRef<'div'>, CategoryDisplayProps>(
//    function CategoryDisplay(
//       { data, category, children, isLoading, isError, book: _, ...props },
//       ref
//    ) {
//       const settings: Settings = {
//          dots: true,
//          infinite: true,
//          speed: 500,
//          arrows: true,
//          slidesToShow: 6,
//          slidesToScroll: 3,
//       };
//       /** TESTING OUT THE COMPONENTS */

//       /** TO HERE!! */
//       return (
//          <CategoryLayout
//             category={category}
//             className='scrollbarX w-auto lg:w-full lg:overflow-hidden'
//          >
//             <CategoryHeader className='mb-4' category={category} />
//             {/* if there is an error inside the section it will be specific to the section */}
//             {isError ? (
//                <div className='text-xl lg:text-2x text-black dark:text-slate-300'>
//                   Sorry, there is an error fetching the data.
//                </div>
//             ) : // same with loading here
//             isLoading ? (
//                <div className='flex items-center justify-center'>
//                   <Spinner size='md' color='indigo' />
//                </div>
//             ) : (
//                /** TESTING FROM HERE ON OUT  */
//                <>
//                            <Slider {...settings}>
//                   {data?.map((book, index) => (
//                      <Fragment key={book.id}>
//                         <div ref={ref} className='container'>
//                            <BookImage
//                               key={book.id + 'image'}
//                               id={book.id}
//                               title={book.volumeInfo.title}
//                               width={getBookWidth(HEIGHT)}
//                               height={HEIGHT}
//                               ref={(el: HTMLDivElement) =>
//                                  setImageRef(getUniqueId(book.id, category), el)
//                               }
//                               onMouseEnter={() =>
//                                  onMouseEnter(getUniqueId(book.id, category), index)
//                               }
//                               bookImage={book.volumeInfo.imageLinks as ImageLinks}
//                               priority={isPriority(category)}
//                               onMouseLeave={(e: React.MouseEvent) => onMouseLeave(e, floatingRef)}
//                               onLoadComplete={() => handleImageLoad(book.id, category)}
//                               routeQuery={encodeRoutes.home(category, meta)}
//                               className={classNames(
//                                  // the description is shown and book image is hovered
//                                  isHovered.hovered &&
//                                     isHovered.id === getUniqueId(book.id, category)
//                                     ? 'opacity-70'
//                                     : 'opacity-100',
//                                  'lg:col-span-1 px-4 lg:px-2 inline-flex items-center justify-center cursor-pointer'
//                               )}
//                            />

//                         </div>
//                         <HoveredBookDescription book={book} category={category} {...props} />
//                         <div className='text-left bg-fixed lg:px-4 lg:text-right'>
//                            <ShowMoreCategory category={category} />
//                         </div>
//                      </Fragment>
//                   ))}
//                   </Slider>
//                </>
//             )}
//          </CategoryLayout>
//       );
//    }
// );

export const CategoryDisplay = forwardRef<React.ElementRef<'div'>, CategoryDisplayProps>(
   function CategoryDisplay({ category, children, isLoading, isError, ...props }, ref) {
      const settings: Settings = {
         dots: true,
         infinite: true,
         speed: 500,
         arrows: true,
         slidesToShow: 6,
         slidesToScroll: 3,
      };
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
                  {/* <div ref={ref} className='relative lg:grid lg:grid-cols-6 container'>
                     {children}
                  </div> */}
                  <div ref={ref} className='container'>
                     <Slider {...settings}>{children}</Slider>
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
