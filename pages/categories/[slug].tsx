import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import classNames from 'classnames';

import useGetCategoryQuery from '@/lib/hooks/useGetCategoryQuery';
import useGetNytBestSeller from '@/lib/hooks/useGetNytBestSeller';
import useFloatingPosition from '@/lib/hooks/useFloatingPosition';

import { getBookWidth, getContainerWidth } from '@/lib/helper/books/getBookWidth';
import { CategoryQuery } from '@/lib/types/serverTypes';
import { GoogleUpdatedFields, ImageLinks, Items, Pages } from '@/lib/types/googleBookTypes';

import { encodeRoutes } from '@/utils/routes';
import { batchFetchGoogleCategories } from '@/utils/fetchData';
import { handleNytId } from '@/utils/handleIds';
import layoutManager from '@/constants/layouts';
import { Categories, categories } from '@/constants/categories';

import { CategoryQualifiers } from '@/models/_api/fetchNytUrl';
import { capitalizeWords } from '@/lib/helper/transformChar';

import { CategoryGridLarge, CategoryGridSmall } from '@/components/contents/category/categoryGrids';
import { BookImageSkeleton, DescriptionSkeleton } from '@/components/loaders/bookcardsSkeleton';
import SingleOrMultipleAuthors from '@/components/bookcover/authors';
import { Divider } from '@/components/layout/dividers';
import BookTitle from '@/components/bookcover/title';
import APIErrorBoundary from '@/components/error/errorBoundary';
import CategoryPageLayout from '@/components/layout/page/categoryPageLayout';

const CategoryDescription = lazy(() => import('@/components/contents/home/categoryDescription'));
const BookImage = lazy(() => import('@/components/bookcover/bookImages'));

const MAX_ITEMS = 20;
const TOTAL_COLS = 5;
const HEIGHT = layoutManager.constants.imageHeight;

export default function BookCategoryPages({
       category,
       data,
    }: InferGetStaticPropsType<typeof getStaticProps>) {
   const [currentPage, setCurrentPage] = useState(1);
   const [pageIndex, setPageIndex] = useState(0);

   useEffect(() => {
      // every time category changes sets back to 0
      setCurrentPage(1);
      setPageIndex(0);
   }, [category]);

   const router = useRouter();
   const enableNytData = category === 'fiction' || category === 'nonfiction';

   const handlePageChange = (newPage: number, type?: 'next' | 'prev') => {
      const apiPageIndex = newPage - 1;

      setCurrentPage(newPage);

      switch (type) {
         case 'next':
            setPageIndex((prev) => prev + MAX_ITEMS);
            break;
         case 'prev':
            if (pageIndex >= MAX_ITEMS) {
               setPageIndex((prev) => prev - MAX_ITEMS);
            }
            break;
         default:
            setPageIndex(apiPageIndex * MAX_ITEMS);
            break;
      }
   };

   const meta = {
      maxResultNumber: MAX_ITEMS,
      pageIndex: pageIndex,
      byNewest: true,
   };

   // stores inside the cache so that it can reference back
   const { data: googleData, cleanedData } = useGetCategoryQuery({
      initialData: data[category] as GoogleUpdatedFields | undefined,
      category: category as Categories,
      enabled: !!data,
      meta: meta,
      keepPreviousData: true,
   });

   // requring both so that each will have its own publication date?
   const { data: bestSellers, isSuccess: isNytDataSuccess } = useGetNytBestSeller({
      category: { format: 'combined-print-and-e-book', type: category } as CategoryQualifiers,
      date: 'current', // the date should be passed(?)
      enabled: enableNytData,
   });

   // displays another container when mouse is hovered
   const {
      isHovered,
      setImageRef,
      floatingRef,
      onMouseEnter,
      onMouseLeave,
      onMouseLeaveDescription,
      largeEnabled,
   } = useFloatingPosition(TOTAL_COLS, true);

   // create a function for this too
   const CATEGORY_NYT_HEADER =
      bestSellers &&
      `${capitalizeWords(category as string)} Best Sellers (${bestSellers.published_date})`;

   if (router.isFallback || googleData.isFetching || googleData.isLoading) {
      return (
         <CategoryPageLayout category={category}>
            <div>Loading...</div>;
         </CategoryPageLayout>
      );
   }

   return (
      <CategoryPageLayout category={category}>
         <APIErrorBoundary>
            {googleData.isSuccess && googleData && (
               <CategoryGridLarge
                  currentPage={currentPage}
                  itemsPerPage={MAX_ITEMS}
                  onPageChange={handlePageChange}
                  totalItems={googleData.data.totalItems}
                  category={`New ${capitalizeWords(category as string)} Releases`}
               >
                  {cleanedData?.map((book, index) => {
                     const hoveredEl = isHovered.id == book.id &&
                        (isHovered.hovered || isHovered.isFloatHovered) && (
                           <div
                              ref={floatingRef}
                              onMouseLeave={onMouseLeaveDescription}
                              style={{
                                 height: HEIGHT,
                                 width: getContainerWidth(
                                    HEIGHT,
                                    layoutManager.categories.widthRatio,
                                    largeEnabled
                                 ),
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
                                    // TODO: with rating write a helper function for total reviews
                                    averageRating={book.volumeInfo?.averageRating}
                                    totalReviews={book.volumeInfo?.ratingsCount}
                                    routeQuery={encodeRoutes.category(category, meta)}
                                 />
                              </Suspense>
                           </div>
                        );
                     return (
                        <>
                           <Suspense
                              fallback={
                                 <BookImageSkeleton height={HEIGHT} getWidth={getBookWidth} />
                              }
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
                                 onMouseLeave={(e: React.MouseEvent) =>
                                    onMouseLeave(e, floatingRef)
                                 }
                                 routeQuery={encodeRoutes.category(category, meta)}
                                 className={classNames(
                                    'lg:col-span-1 px-1 inline-flex items-center justify-center lg:px-0 cursor-pointer'
                                 )}
                              />
                           </Suspense>
                           {hoveredEl}
                        </>
                     );
                  })}
               </CategoryGridLarge>
            )}
            {/* if it is not fiction or nonfiction or not successful wont work */}
            {isNytDataSuccess && enableNytData && bestSellers && (
               <>
                  <Divider />
                  <CategoryGridSmall category={CATEGORY_NYT_HEADER}>
                     {bestSellers.books.map((book, index) => (
                        <div
                           className='flex flex-row items-start space-x-2'
                           key={book.primary_isbn13}
                        >
                           <Suspense
                              fallback={
                                 <BookImageSkeleton height={HEIGHT} getWidth={getBookWidth} />
                              }
                           >
                              <BookImage
                                 id={handleNytId.appendSuffix(book.primary_isbn13)}
                                 title={book.title}
                                 width={getBookWidth(HEIGHT)}
                                 height={HEIGHT}
                                 bookImage={book.book_image}
                                 priority={false}
                                 className={classNames('lg:col-span-1 px-1 lg:px-0 cursor-pointer')}
                                 routeQuery={encodeRoutes.category(category, meta)}
                              />
                           </Suspense>
                           <div className='flex flex-col items-start justify-start w-full'>
                              <h4 className='text-lg dark:text-slate-200'>Rank: {book.rank}</h4>
                              <BookTitle
                                 id={handleNytId.appendSuffix(book.primary_isbn13)}
                                 title={capitalizeWords(book.title)}
                                 routeQuery={encodeRoutes.category(category, meta)}
                                 className='text-lg lg:text-xl hover:underline hover:decoration-orange-400 hover:dark:decoration-orange-200'
                              />
                              <p className='text-sm text-clip space-x-0.5'>
                                 <span className='dark:text-slate-50'>by{': '}</span>
                                 <SingleOrMultipleAuthors
                                    hoverUnderline={true}
                                    authors={book.author}
                                 />
                              </p>
                           </div>
                        </div>
                     ))}
                  </CategoryGridSmall>
               </>
            )}
         </APIErrorBoundary>
      </CategoryPageLayout>
   );
}

// retrieve categories in their library and see whether the library
// can it retrieve new released?
// is inside the cateogry that is being clicked

const sampleCat = categories.slice(0, 4);

export const getStaticPaths: GetStaticPaths = async () => {
   const paths = sampleCat.map((category) => ({
      params: { slug: category.toLowerCase() },
   }));

   return {
      paths,
      fallback: true,
   };
};

// would this only hit the api request for every time a page is visited?
export const getStaticProps: GetStaticProps<{
   data: CategoryQuery;
   category: string;
}> = async ({ params }) => {
   const category = params?.slug as string;

   // change this after production where it will generate all categories in build time
   // const sampleCat = categories.slice(0, 4);

   // change this to categories when testing this out
   const googleData = await batchFetchGoogleCategories(sampleCat, {
      // maxResultNumber: MAX_ITEMS,
      maxResultNumber: 15,
      pageIndex: 0,
      byNewest: true,
   });

   return {
      props: {
         data: googleData as CategoryQuery,
         category: category,
      },
      revalidate: 60 * 60 * 6, // wont revalidate for at least the next 6 hours
   };
};
