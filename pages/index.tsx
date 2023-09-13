import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGetCategoriesQueries } from '../lib/hooks/useGetCategoryQuery';
import HomeLayout from '../components/layout/page/home';
import { CategoryDescription, CategoryDisplay } from '../components/home/categories';
import BookImage from '../components/bookcover/bookImages';
import { ImageLinks, Items, Pages } from '../lib/types/googleBookTypes';
import classNames from 'classnames';
import { useDisableBreakPoints } from '../lib/hooks/useDisableBreakPoints';
import googleApi from '../models/_api/fetchGoogleUrl';
import { Categories, TopCateogry, categories, topCategories } from '../constants/categories';
import createUniqueDataSets, { createUniqueData } from '../lib/helper/books/filterUniqueData';
import { fetcher } from '../utils/fetchData';
import nytApi, { CategoryQualifiers } from '../models/_api/fetchNytUrl';
import { BestSellerData, ReviewData } from '../lib/types/nytBookTypes';
import {
   CategoriesNytQueries,
   CategoriesQueries,
   InferServerSideProps,
} from '../lib/types/serverPropsTypes';
import useGetNytBestSeller, { useGetNytBestSellers } from '../lib/hooks/useGetNytBestSeller';

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

// the width ratio depends on the size;
const getWidth = (
   height: number,
   type: 'image' | 'container' = 'image',
   isLargeScreen: boolean
) => {
   const ratio = isLargeScreen ? WIDTH_RATIO : WIDTH_RATIO - 1;
   return type === 'container' ? height * ratio : height * (3 / 4.25);
};

const changeDirection = (
   width: number,
   itemIndex: number,
   totalColumns: number,
   threshold: number = totalColumns
) => {
   const offsetBy = 5;
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

const Home = (props: InferServerSideProps) => {
   // combine the two data(?)
   const { data, bestSellerData } = props;
   const { dataWithKeys: googleData } = useGetCategoriesQueries(data);
   const { transformedData: nytData } = useGetNytBestSellers({ initialData: bestSellerData });

   const combinedData = { ...nytData, ...googleData } as CategoriesQueries;

   const floatingRef = useRef<HTMLDivElement>(null);
   const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});

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

   return (
      <>
         {Object.entries(combinedData).map(([key, value]) => (
            <CategoryDisplay key={key} category={key as Categories}>
               {value &&
                  value?.map((book, index) => {
                     const hoveredEl = isHovered.id == book.id &&
                        (isHovered.hovered || isHovered.isFloatHovered) && (
                           <div
                              ref={floatingRef}
                              onMouseLeave={onMouseLeaveDescription}
                              style={{
                                 height: CONTAINER_HEIGHT,
                                 width: getWidth(HEIGHT, 'container', largeEnabled),
                              }}
                              className='absolute z-50 rounded-lg'
                           >
                              <CategoryDescription
                                 id={book.id}
                                 title={book.volumeInfo.title}
                                 subtitle={book.volumeInfo.subtitle}
                                 authors={book.volumeInfo.authors}
                                 description={book.volumeInfo.description}
                              />
                           </div>
                        );
                     return (
                        <>
                           <BookImage
                              key={book.id}
                              bookImage={book.volumeInfo.imageLinks as ImageLinks}
                              width={getWidth(HEIGHT, 'image', largeEnabled)}
                              height={HEIGHT}
                              forwardedRef={(el: HTMLDivElement) => setImageRef(book.id, el)}
                              title={book.volumeInfo.title}
                              priority // set the priorioty a bit different for later indexes
                              onMouseEnter={() => onMouseEnter(book.id, index)}
                              onMouseLeave={(e: React.MouseEvent) => onMouseLeave(e)}
                              className={classNames(
                                 // index % 2 ? 'bg-blue-100' : 'bg-red-100',
                                 'lg:col-span-1 px-1 lg:px-0 cursor-pointer'
                              )}
                           />
                           {hoveredEl}
                        </>
                     );
                  })}
            </CategoryDisplay>
         ))}
      </>
   );
};

export default Home;

export const getServerSideProps = async () => {
   const data: CategoriesQueries = {};
   const bestSellerData: CategoriesNytQueries = {};

   // the caveat here is that this is not full proof of parsing duplicated items
   // however given that it will only have six books it will be highly unlikely for
   // having mulitple duplicated books
   for (let category of topCategories) {
      category = category.toLocaleLowerCase();
      const url = googleApi.getUrlBySubject(category as Categories, {
         maxResultNumber: 15,
         pageIndex: 0,
      });

      const json = await fetcher(url);

      if (!json) {
         data[category] = null;
      }

      const uniqueData = createUniqueData(json) as Items<any>[];
      data[category] = uniqueData?.slice(0, 6);
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
         data,
         bestSellerData,
      },
   };
};

// using getServerSideProps to access google api
// and store it in the client side because the data will
// be static(?) and will retrieve by the results to retrieve almost all of the queries
// and prefetch the data

// export const getServerSideProps = async (context: any) => {
//    const getUser = await getSession(context);
//    const userId = getUserId(getUser as object, 'id');
//    // const bookGetter = new BookGetter(userId);
//    // const data = await bookGetter.getCurrentOrPrimary();

//    const getter = new ReadingGetter(userId);
//    const data = await getter.getEditPrimaryData();
//    return {
//       props: {
//          userId: userId,
//          data: data,
//       },
//    };
// };

// TESTING
// if (!data) {
//    return (
//       // "track your data here" w/ link to the book page
//       <Link as={`/profile/${userId}/searchbook`} href={`/profile/[id]/searchbook`}></Link>
//    );
// }

// here even for some categoires can prefetch and cache it no?
// and use initialData defined by its queryKeys to work with all of this

// this wont happen with recommended lists or best sellers(?)
// see NYT bestsellers lists for more
