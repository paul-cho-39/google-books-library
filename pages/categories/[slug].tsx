import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import googleApi from '../../models/_api/fetchGoogleUrl';
import { fetcher } from '../../utils/fetchData';

import useGetCategoryQuery from '../../lib/hooks/useGetCategoryQuery';
import useGetNytBestSeller from '../../lib/hooks/useGetNytBestSeller';

import { CustomSession } from '../../lib/types/serverPropsTypes';
import { ImageLinks, Items, Pages } from '../../lib/types/googleBookTypes';
import { Categories } from '../../constants/categories';
import { CategoryQualifiers } from '../../models/_api/fetchNytUrl';
import { capitalizeWords } from '../../utils/transformChar';
import useHoverDisplayDescription from '../../lib/hooks/useHoverDisplay';
import {
   CategoryGridLarge,
   CategoryGridSmall,
} from '../../components/contents/category/categoryGridLarge ';
import { BookImageSkeleton, DescriptionSkeleton } from '../../components/loaders/bookcardsSkeleton';
import { getBookWidth, getContainerWidth } from '../../utils/getBookWidth';
import classNames from 'classnames';
import { useDisableBreakPoints } from '../../lib/hooks/useDisableBreakPoints';
import { changeDirection } from '../../utils/reverseDescriptionPos';
import { routes } from '../../constants/routes';
import { createUniqueData } from '../../lib/helper/books/filterUniqueData';
import { handleNytId } from '../../lib/helper/books/handleIds';
import { Divider } from '../../components/layout/dividers';
import BookTitle from '../../components/bookcover/title';
import SingleOrMultipleAuthors from '../../components/bookcover/authors';
import Pagination from '../../components/headers/pagination';

const SMALL_SCREEN = 768;
const PADDING = 1; // have to add margin from the components
const WIDTH_RATIO = 2.5;
const HEIGHT = 150;
const CONTAINER_HEIGHT = 150; // may subject to change

const CategoryDescription = lazy(
   () => import('../../components/contents/home/categoryDescription')
);
const BookImage = lazy(() => import('../../components/bookcover/bookImages'));

const MAX_ITEMS = 15;

export default function BookCategoryPages({
   category,
   userId,
   recentlyPublishedData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const [currentPage, setCurrentPage] = useState(0);
   const enableNytData = category === 'fiction' || category === 'nonfiction';

   const { data: googleData, cleanedData } = useGetCategoryQuery({
      initialData: recentlyPublishedData,
      category: category as Categories,
      enabled: !!recentlyPublishedData,
      meta: {
         maxResultNumber: MAX_ITEMS,
         pageIndex: currentPage,
         byNewest: true,
      },
      keepPreviousData: true,
   });

   const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
   };

   const { data: bestSellers, isSuccess } = useGetNytBestSeller({
      category: { format: 'combined-print-and-e-book', type: category } as CategoryQualifiers,
      date: 'current',
      enabled: enableNytData,
   });

   const floatingRef = useRef<HTMLDivElement>(null);
   const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});

   const { isHovered, onMouseEnter, onMouseLeave, onMouseLeaveDescription } =
      useHoverDisplayDescription();

   const setImageRef = useCallback((id: string, el: HTMLDivElement | null) => {
      if (imageRefs.current) imageRefs.current[id] = el;
   }, []);

   const largeEnabled = useDisableBreakPoints();

   useEffect(() => {
      if (
         isHovered.id &&
         isHovered.index &&
         isHovered.hovered &&
         floatingRef.current &&
         imageRefs.current
      ) {
         const el = imageRefs.current[isHovered.id]?.getBoundingClientRect();

         if (el) {
            const currentIdx = isHovered.index - 1;
            const row = Math.floor(currentIdx / 5);
            const height = (el.top + window.scrollY) / (row + 1);
            const top = height * row;

            const position = changeDirection(el.width, isHovered.index, 5, 5 - 1, PADDING, 15);

            floatingRef.current.style.top = `${top}px`;
            floatingRef.current.style.position = 'absolute';

            if (position.right > 0) {
               floatingRef.current.style.right = `${position.right}px`;
            } else {
               floatingRef.current.style.left = `${position.left}px`;
            }
         }
      }
   }, [isHovered, largeEnabled]);

   const CATEGORY_NYT_HEADER =
      bestSellers &&
      `${capitalizeWords(category as string)} Best Sellers (${bestSellers.published_date})`;

   return (
      <div className='min-h-screen w-full'>
         <CategoryGridLarge category={`New ${capitalizeWords(category as string)} Releases`}>
            {cleanedData?.map((book, index) => {
               const hoveredEl = isHovered.id == book.id &&
                  (isHovered.hovered || isHovered.isFloatHovered) && (
                     <div
                        ref={floatingRef}
                        onMouseLeave={onMouseLeaveDescription}
                        style={{
                           height: CONTAINER_HEIGHT,
                           width: getContainerWidth(HEIGHT, WIDTH_RATIO, largeEnabled),
                        }}
                        className='absolute z-50 rounded-lg'
                     >
                        <Suspense fallback={<DescriptionSkeleton />}>
                           <CategoryDescription
                              id={book.id}
                              title={book.volumeInfo.title}
                              subtitle={book.volumeInfo.subtitle}
                              authors={book.volumeInfo.authors}
                              description={book.volumeInfo.description}
                              fromPage={routes.category}
                           />
                        </Suspense>
                     </div>
                  );
               return (
                  <>
                     <Suspense
                        fallback={<BookImageSkeleton height={HEIGHT} getWidth={getBookWidth} />}
                     >
                        <BookImage
                           key={book.id}
                           id={book.id}
                           title={book.volumeInfo.title}
                           width={getBookWidth(HEIGHT)}
                           height={HEIGHT}
                           forwardedRef={(el: HTMLDivElement) => setImageRef(book.id, el)}
                           bookImage={book.volumeInfo.imageLinks as ImageLinks}
                           priority={false}
                           onMouseEnter={() => onMouseEnter(book.id, index)}
                           onMouseLeave={(e: React.MouseEvent) => onMouseLeave(e, floatingRef)}
                           className={classNames('lg:col-span-1 px-1 lg:px-0 cursor-pointer')}
                           fromPage={routes.category}
                        />
                     </Suspense>
                     {hoveredEl}
                  </>
               );
            })}
         </CategoryGridLarge>
         <Pagination
            currentPage={currentPage}
            itemsPerPage={MAX_ITEMS}
            onPageChange={handlePageChange}
            totalItems={googleData.data.totalItems}
         />
         {isSuccess && bestSellers && (
            <>
               <Divider />
               <CategoryGridSmall category={CATEGORY_NYT_HEADER}>
                  {bestSellers.books.map((book, index) => (
                     <div className='flex flex-row items-start' key={book.primary_isbn13}>
                        <Suspense
                           fallback={<BookImageSkeleton height={HEIGHT} getWidth={getBookWidth} />}
                        >
                           <BookImage
                              // key={book.primary_isbn13}
                              id={handleNytId.appendSuffix(book.primary_isbn13)}
                              title={book.title}
                              width={getBookWidth(HEIGHT)}
                              height={HEIGHT}
                              bookImage={book.book_image}
                              priority={false}
                              className={classNames('lg:col-span-1 px-1 lg:px-0 cursor-pointer')}
                              fromPage={routes.category}
                           />
                        </Suspense>
                        <div className='flex flex-col items-start justify-start w-full'>
                           <h4 className='text-lg dark:text-slate-200'>Rank: {book.rank}</h4>
                           <BookTitle
                              id={handleNytId.appendSuffix(book.primary_isbn13)}
                              title={capitalizeWords(book.title)}
                              className='text-lg lg:text-xl'
                           />
                           <p className='text-sm text-clip space-x-0.5 not-first:text-blue-700 not-first:hover:text-blue-500 not-first:dark:text-blue-400 '>
                              <span className='dark:text-slate-50'>by{': '}</span>
                              <SingleOrMultipleAuthors authors={book.author} />
                           </p>
                        </div>
                     </div>
                  ))}
               </CategoryGridSmall>
            </>
         )}
      </div>
   );
}

// retrieve categories in their library and see whether the library
// can it retrieve new released?
// is inside the cateogry that is being clicked
//

export const getServerSideProps: GetServerSideProps<{
   category: Categories | CategoryQualifiers['type'];
   userId: string | null;
   recentlyPublishedData: Pages<Record<string, string>>;
}> = async (context: any) => {
   const category = context.query.slug;

   const session = await getSession(context);
   const user = session?.user as CustomSession;
   const userId = user?.id || null;

   const url = googleApi.getUrlBySubject(category, {
      maxResultNumber: MAX_ITEMS,
      pageIndex: 0,
      byNewest: true,
   });

   const data = await fetcher(url);

   return {
      props: {
         category: category,
         userId: userId,
         recentlyPublishedData: data || null,
      },
   };
};
