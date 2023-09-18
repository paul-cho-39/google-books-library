import { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useGetCategoriesQueries } from '../lib/hooks/useGetCategoryQuery';
import { CategoryDisplay } from '../components/home/categories';
import { ImageLinks, Items, Pages } from '../lib/types/googleBookTypes';
import classNames from 'classnames';
import { useDisableBreakPoints } from '../lib/hooks/useDisableBreakPoints';
import googleApi from '../models/_api/fetchGoogleUrl';
import { Categories, serverSideCategories, topCategories } from '../constants/categories';
import createUniqueDataSets, { createUniqueData } from '../lib/helper/books/filterUniqueData';
import { fetcher } from '../utils/fetchData';
import nytApi, { CategoryQualifiers } from '../models/_api/fetchNytUrl';
import { BestSellerData, ReviewData } from '../lib/types/nytBookTypes';
import {
   CategoriesNytQueries,
   CategoriesQueries,
   InferServerSideProps,
} from '../lib/types/serverPropsTypes';
import { useGetNytBestSellers } from '../lib/hooks/useGetNytBestSeller';
import { getBookWidth, getContainerWidth } from '../utils/getBookWidth';
import { BookImageSkeleton, DescriptionSkeleton } from '../components/loaders/bookcardsSkeleton';
import { DividerButtons } from '../components/layout/dividers';
import { useQueryClient } from '@tanstack/react-query';
import queryKeys from '../lib/queryKeys';

type HoveredProps = {
   id: string | null;
   hovered: boolean;
   isFloatHovered: boolean;
   index: number | null;
};

const SMALL_SCREEN = 768;
const PADDING = 1; // have to add margin from the components
const WIDTH_RATIO = 3.2;
const HEIGHT = 150;
const CONTAINER_HEIGHT = 150; // may subject to change

const changeDirection = (
   width: number,
   itemIndex: number,
   totalColumns: number,
   threshold: number = totalColumns
) => {
   const offsetBy = 8;
   const currentIndex =
      itemIndex === totalColumns || itemIndex % totalColumns === 0
         ? totalColumns
         : itemIndex % totalColumns;

   if (currentIndex >= threshold) {
      const mult = totalColumns + 1 - currentIndex;
      return {
         right: (PADDING + width) * mult + offsetBy,
         left: 0,
      };
   }

   return { left: (PADDING + width) * currentIndex - offsetBy, right: 0 };
};

const CategoryDescription = lazy(() => import('../components/home/categoryDescription'));
const BookImage = lazy(() => import('../components/bookcover/bookImages'));

const Home = (props: InferServerSideProps) => {
   const [categoriesToLoad, setCategoriesToLoad] = useState(0);
   const queryClient = useQueryClient();
   const cache = queryClient.getQueryData(queryKeys.allGoogleCategories) as CategoriesQueries;
   console.log('the new data is now: ', cache);

   // combine the two data(?)
   const { googleData, bestSellerData } = props;
   const { categoryData, dataWithKeys: data } = useGetCategoriesQueries({
      initialData: googleData,
      loadItems: categoriesToLoad,
   });
   const { transformedData: nytData } = useGetNytBestSellers({ initialData: bestSellerData });

   const combinedData = { ...nytData, ...data } as CategoriesQueries;

   const floatingRef = useRef<HTMLDivElement>(null);
   const categoryRefs = useRef<HTMLDivElement>(null);
   const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});

   const handleProcessData = () => {
      setCategoriesToLoad((prev) => prev + 4);
   };

   // make this into a hook
   const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout>(null!);
   const [isHovered, setIsHovered] = useState<HoveredProps>({
      id: null,
      hovered: false,
      isFloatHovered: false,
      index: null,
   });

   const setImageRef = useCallback((id: string, el: HTMLDivElement | null) => {
      if (imageRefs.current) imageRefs.current[id] = el;
   }, []);

   // getting number of grids
   const largeEnabled = useDisableBreakPoints();
   const smallEnabled = useDisableBreakPoints(SMALL_SCREEN);
   const NUMBER_OF_COLS = largeEnabled ? 6 : smallEnabled ? 4 : 3;

   const onMouseEnter = (id: string, index: number) => {
      if (!id) return;

      clearTimeout(hoverTimer);
      setHoverTimer(
         setTimeout(() => {
            setIsHovered({ id, hovered: true, isFloatHovered: false, index: index + 1 });
         }, 350)
      );
   };

   // still to be tested for this one!;
   const onMouseLeave = (e: React.MouseEvent) => {
      const floatingElement = floatingRef.current;

      if (
         floatingElement &&
         e.relatedTarget instanceof Node &&
         floatingElement.contains(e.relatedTarget)
      ) {
         return;
      }

      clearTimeout(hoverTimer);
      if (isHovered.id !== null) {
         setIsHovered({ id: null, hovered: false, isFloatHovered: false, index: null });
      }
   };

   const onMouseLeaveDescription = () => {
      clearTimeout(hoverTimer);
      if (isHovered.id !== null) {
         setIsHovered({ id: null, hovered: false, isFloatHovered: false, index: null });
      }
   };

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
            const position = changeDirection(
               el.width,
               isHovered.index,
               NUMBER_OF_COLS,
               NUMBER_OF_COLS - 1
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
   }, [NUMBER_OF_COLS, isHovered]);

   // images that are not server rendered are rendered later
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
                                 bookImage={book.volumeInfo.imageLinks as ImageLinks}
                                 width={getBookWidth(HEIGHT)}
                                 height={HEIGHT}
                                 forwardedRef={(el: HTMLDivElement) => setImageRef(book.id, el)}
                                 title={book.volumeInfo.title}
                                 priority={isPriority(key)}
                                 onMouseEnter={() => onMouseEnter(book.id, index)}
                                 onMouseLeave={(e: React.MouseEvent) => onMouseLeave(e)}
                                 className={classNames('lg:col-span-1 px-1 lg:px-0 cursor-pointer')}
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

// retrieve the first results in the beginning
// then pass the rest(?);

export const getServerSideProps = async () => {
   const googleData: CategoriesQueries = {};
   const bestSellerData: CategoriesNytQueries = {};

   // the caveat here is that this is not full proof of parsing duplicated items
   // however given that it will only have six books it will be highly unlikely for
   // having mulitple duplicated books
   for (let category of serverSideCategories) {
      category = category.toLocaleLowerCase();
      const url = googleApi.getUrlBySubject(category as Categories, {
         maxResultNumber: 15,
         pageIndex: 0,
      });

      const json = await fetcher(url);

      if (!json) {
         googleData[category] = null;
      }

      const uniqueData = createUniqueData(json) as Items<any>[];
      googleData[category] = uniqueData?.slice(0, 6);
   }

   const promises = ['fiction', 'nonfiction'].map(async (key) => {
      const url = nytApi.getUrlByCategory({
         format: 'combined-print-and-e-book',
         type: key as CategoryQualifiers['type'],
      });
      const json = (await fetcher(url)) as ReviewData<BestSellerData>;
      bestSellerData[key] = {
         ...json.results,
         books: json.results.books.slice(0, 6),
      };
   });

   await Promise.all(promises);

   return {
      props: {
         googleData,
         bestSellerData,
      },
   };
};
