import { GetServerSideProps, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { CategoryDisplay } from '../components/contents/home/categories';
import { GoogleUpdatedFields, ImageLinks, Items, Pages } from '../lib/types/googleBookTypes';
import classNames from 'classnames';

import { useDisableBreakPoints } from '../lib/hooks/useDisableBreakPoints';
import useHoverDisplayDescription from '../lib/hooks/useHoverDisplay';
import { useGetCategoriesQueries } from '../lib/hooks/useGetCategoryQuery';

import { Categories, serverSideCategories, topCategories } from '../constants/categories';
import { getBookWidth, getContainerWidth } from '../utils/getBookWidth';
import { changeDirection } from '../utils/reverseDescriptionPos';

import { BookImageSkeleton, DescriptionSkeleton } from '../components/loaders/bookcardsSkeleton';
import { DividerButtons } from '../components/layout/dividers';
import layoutManager from '../constants/layouts';
import routes from '../constants/routes';
import { batchFetchGoogleCategories } from '../models/cache/handleGoogleCache';
import { getSession, useSession } from 'next-auth/react';
import { useGetNytBestSellers } from '../lib/hooks/useGetNytBestSeller';
import { CategoriesQueries } from '../lib/types/serverPropsTypes';

const CategoryDescription = lazy(() => import('../components/contents/home/categoryDescription'));
const BookImage = lazy(() => import('../components/bookcover/bookImages'));

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
   const { data } = props;

   const { data: user } = useSession();
   const [categoriesToLoad, setCategoriesToLoad] = useState(0);

   const { categoryData, dataWithKeys: googleData } = useGetCategoriesQueries({
      initialData: data,
      loadItems: categoriesToLoad,
      enabled: !!data,
   });

   const { transformedData: nytData } = useGetNytBestSellers({});
   const combinedData = { ...nytData, ...googleData };

   const floatingRef = useRef<HTMLDivElement>(null);
   const categoryRefs = useRef<HTMLDivElement>(null);
   const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});

   const { isHovered, onMouseEnter, onMouseLeave, onMouseLeaveDescription } =
      useHoverDisplayDescription();

   const handleProcessData = () => {
      setCategoriesToLoad((prev) => prev + 4);
   };

   const setImageRef = useCallback((id: string, el: HTMLDivElement | null) => {
      if (imageRefs.current) imageRefs.current[id] = el;
   }, []);

   // getting number of grids
   const largeEnabled = useDisableBreakPoints();
   const smallEnabled = useDisableBreakPoints(layoutManager.constants.smallScreen);
   const NUMBER_OF_COLS = largeEnabled ? 6 : smallEnabled ? 4 : 3;

   useEffect(() => {
      if (
         isHovered.id &&
         isHovered.index &&
         isHovered.hovered &&
         floatingRef.current &&
         imageRefs.current
      ) {
         const el = imageRefs.current[isHovered.id]?.getBoundingClientRect();
         const largeReverseGrid = largeEnabled ? NUMBER_OF_COLS - 2 : NUMBER_OF_COLS - 1;

         if (el) {
            const position = changeDirection(
               el.width,
               isHovered.index,
               NUMBER_OF_COLS,
               largeReverseGrid,
               layoutManager.home.padding,
               layoutManager.home.offset
            );

            floatingRef.current.style.top = `${0}px`;
            floatingRef.current.style.position = 'absolute';

            if (position.right > 0) {
               floatingRef.current.style.right = `${position.right}px`;
            } else {
               floatingRef.current.style.left = `${position.left}px`;
            }
         }
      }
   }, [NUMBER_OF_COLS, isHovered, largeEnabled]);

   // images that are not server rendered are rendered later
   const HEIGHT = layoutManager.constants.imageHeight;

   const priorityCategories = ['FICTION', 'NONFICTION', ...serverSideCategories];
   const isPriority = (category: string) => priorityCategories.includes(category.toUpperCase());

   // TODO: Create an error boundary for this?

   return (
      <>
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
                              <Suspense fallback={<DescriptionSkeleton />}>
                                 <CategoryDescription
                                    id={book.id}
                                    title={book.volumeInfo.title}
                                    subtitle={book.volumeInfo.subtitle}
                                    authors={book.volumeInfo.authors}
                                    description={book.volumeInfo.description}
                                    fromPage={routes.home(key)}
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
                                 priority={isPriority(key)}
                                 onMouseEnter={() => onMouseEnter(book.id, index)}
                                 onMouseLeave={(e: React.MouseEvent) =>
                                    onMouseLeave(e, floatingRef)
                                 }
                                 fromPage={routes.home(key)}
                                 className={classNames(
                                    isHovered.hovered && isHovered.id === book.id
                                       ? 'opacity-70'
                                       : 'opacity-100',
                                    'lg:col-span-1 px-4 lg:px-0 cursor-pointer'
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
      </>
   );
};

export default Home;

// change the categories later
// getSession() -> use userId right?
export const getStaticProps: GetStaticProps<{
   data: CategoriesQueries;
}> = async () => {
   const googleData = (await batchFetchGoogleCategories(serverSideCategories, {
      maxResultNumber: 15,
      pageIndex: 0,
      byNewest: true,
   })) as CategoriesQueries;

   return {
      props: {
         data: googleData,
      },
      revalidate: 60 * 60 * 12,
   };
};

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//    const googleData: CategoriesQueries = {};

//    // the caveat here is that this is not full proof of parsing duplicated items
//    // however given that it will only have six books it will be highly unlikely for
//    // having mulitple duplicated books
//    for (let category of serverSideCategories) {
//       category = category.toLocaleLowerCase();

//       const res = await fetchDataFromCache<GoogleUpdatedFields>(category, {
//          source: 'google',
//          endpoint: 'relevant',
//          req,
//       });
//       const data = res.data;

//       if (!data) {
//          googleData[category] = null;
//       }

//       googleData[category] = data.items;
//    }

//    return {
//       props: {
//          googleData,
//       },
//    };
// };
