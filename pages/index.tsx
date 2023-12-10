import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRef, useState, lazy, Suspense } from 'react';
import { CategoryDisplay } from '@/components/contents/home/categories';
import { ImageLinks } from '@/lib/types/googleBookTypes';
import classNames from 'classnames';

import { useGetCategoriesQueries } from '@/lib/hooks/useGetCategoryQuery';

import { Categories, serverSideCategories, topCategories } from '@/constants/categories';
import { getBookWidth, getContainerWidth } from '@/lib/helper/books/getBookWidth';

import { BookImageSkeleton, DescriptionSkeleton } from '@/components/loaders/bookcardsSkeleton';
import { DividerButtons } from '@/components/layout/dividers';
import layoutManager from '@/constants/layouts';
import { batchFetchGoogleCategories } from '@/utils/fetchData';
import { useGetNytBestSellers } from '@/lib/hooks/useGetNytBestSeller';
import { CategoriesQueries } from '@/lib/types/serverTypes';
import { encodeRoutes } from '@/utils/routes';
import useFloatingPosition from '@/lib/hooks/useFloatingPosition';
import HomeLayout from '@/components/layout/page/homeLayout';
import useImageLoadTracker from '@/lib/hooks/useImageLoadTracker';
import getTotalItemsLength from '@/lib/helper/getObjLength';

const CategoryDescription = lazy(() => import('@/components/contents/home/categoryDescription'));
const BookImage = lazy(() => import('@/components/bookcover/bookImages'));

const MAX_RESULT = 6;
const TOTAL_COLS = 6;

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
   const { data } = props;
   const [categoriesToLoad, setCategoriesToLoad] = useState(0);

   const categoryRefs = useRef<HTMLDivElement>(null);

   const meta = {
      maxResultNumber: MAX_RESULT,
      pageIndex: 0,
      byNewest: false,
   };

   const {
      dataWithKeys: googleData,
      isGoogleDataSuccess,
      isGoogleDataLoading,
      queriesData,
   } = useGetCategoriesQueries({
      initialData: data,
      loadItems: categoriesToLoad, // load more items here
      enabled: !!data,
      meta,
      returnNumberOfItems: MAX_RESULT,
   });

   const { transformedData: nytData, dataIsSuccess: nytDataSuccess } = useGetNytBestSellers({});

   const combinedData = { ...nytData, ...googleData };

   const { handleImageLoad, areAllImagesLoaded } = useImageLoadTracker();
   const areImagesLoadComplete = areAllImagesLoaded(
      getTotalItemsLength(combinedData as Record<string, unknown[]>)
   );

   const handleProcessData = () => {
      setCategoriesToLoad((prev) => prev + 4);
   };

   const {
      isHovered,
      floatingRef,
      largeEnabled,
      setImageRef,
      onMouseEnter,
      onMouseLeave,
      onMouseLeaveDescription,
   } = useFloatingPosition(TOTAL_COLS, false);

   // images that are not server rendered are rendered later
   const HEIGHT = layoutManager.constants.imageHeight;

   const priorityCategories = ['FICTION', 'NONFICTION', ...serverSideCategories];
   const isPriority = (category: string) => priorityCategories.includes(category.toUpperCase());

   // TODO: Create an error boundary for this
   if (!nytDataSuccess && !isGoogleDataLoading) {
      return (
         <HomeLayout>
            <div>Is Loading...</div>
         </HomeLayout>
      );
   }

   return (
      <HomeLayout>
         {Object.entries(combinedData).map(([key, value], index) => (
            <CategoryDisplay key={key} forwardRef={categoryRefs} category={key as Categories}>
               {value &&
                  value?.map((book, index) => {
                     const hoveredEl = isHovered.id == book.id &&
                        (isHovered.hovered || isHovered.isFloatHovered) && (
                           <div
                              ref={floatingRef}
                              onMouseLeave={onMouseLeaveDescription}
                              style={{
                                 height: HEIGHT,
                                 width: getContainerWidth(
                                    HEIGHT,
                                    layoutManager.home.widthRatio,
                                    largeEnabled
                                 ),
                              }}
                              className='absolute z-50 rounded-lg'
                           >
                              {areImagesLoadComplete && (
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
                                       routeQuery={encodeRoutes.home(key, meta)}
                                    />
                                 </Suspense>
                              )}
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
                                 priority={isPriority(key)}
                                 onMouseEnter={() => onMouseEnter(book.id, index)}
                                 onMouseLeave={(e: React.MouseEvent) =>
                                    onMouseLeave(e, floatingRef)
                                 }
                                 onLoadComplete={() => handleImageLoad(book.id)}
                                 routeQuery={encodeRoutes.home(key, meta)}
                                 className={classNames(
                                    isHovered.hovered && isHovered.id === book.id
                                       ? 'opacity-70'
                                       : 'opacity-100',
                                    'lg:col-span-1 px-4 lg:px-2 inline-flex items-center justify-center cursor-pointer'
                                 )}
                              />
                           </Suspense>
                           {hoveredEl}
                        </>
                     );
                  })}
            </CategoryDisplay>
         ))}
         <DividerButtons onClick={handleProcessData} condition={false} title='Load More' />
      </HomeLayout>
   );
};

export default Home;

// change the categories later
// getSession() -> use userId right?
export const getStaticProps: GetStaticProps<{
   data: CategoriesQueries;
}> = async () => {
   const googleData = (await batchFetchGoogleCategories(serverSideCategories, {
      maxResultNumber: MAX_RESULT + 4, // there are duplicate data and to ensure there are at least six
      pageIndex: 0,
      byNewest: false,
   })) as CategoriesQueries;

   return {
      props: {
         data: googleData,
      },
      revalidate: 60 * 60 * 12,
   };
};
