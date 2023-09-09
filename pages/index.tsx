import type { InferGetServerSidePropsType, NextPage } from 'next';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getSession } from 'next-auth/react';
import getUserId from '../lib/helper/getUserId';

import Link from 'next/link';
import { ReadingGetter } from '../lib/prisma/class/get/bookgetter';
import useCategoryQuery, { useCategoriesQueries } from '../lib/hooks/useCategoryQuery';
import HomeLayout from '../components/layout/page/home';
import { CategoryDescription, CategoryDisplay } from '../components/home/categories';
import BookImage from '../components/bookcover/bookImages';
import { ImageLinks, Items, Pages } from '../lib/types/googleBookTypes';
import classNames from 'classnames';
import { useDisableBreakPoints } from '../lib/hooks/useDisableBreakPoints';
import googleApi, { fetcher } from '../lib/helper/books/fetchGoogleUrl';
import { Categories, TopCateogry, categories, topCategories } from '../constants/categories';
import createUniqueDataSets, { createUniqueData } from '../lib/helper/books/filterUniqueData';

export type CategoriesDataParams = Record<TopCateogry, Pages<any> | null>;
export type CategoriesQueries = Record<TopCateogry, Items<any>[] | null>;

export type CurrentOrReadingProps = InferGetServerSidePropsType<typeof getServerSideProps>;

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
const CONTAINER_HEIGHT = 150;

// the width ratio depends on the size;
export const getWidth = (
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

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
   // const { data, userId } = props;
   const { data } = props;
   const { dataWithKeys } = useCategoriesQueries(data);

   const floatingRef = useRef<HTMLDivElement>(null);
   const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});
   const [dateValue, setDateValue] = useState<Date>(new Date());

   // make this into a hook
   const [isHovered, setIsHovered] = useState<HoveredProps>({
      id: null,
      hovered: false,
      isFloatHovered: false,
      index: null,
   });
   const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout>(null!);

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
            const top = el.top - el.height - 27;

            floatingRef.current.style.top = `${0}px`; // have to fix this number;
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
      <HomeLayout>
         {Object.entries(dataWithKeys).map(([key, value]) => (
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
                              onMouseEnter={() => onMouseEnter(book.id, index)}
                              onMouseLeave={(e: React.MouseEvent) => onMouseLeave(e)}
                              className={classNames(
                                 // index % 2 ? 'bg-blue-100' : 'bg-red-100',
                                 'col-span-1 cursor-pointer'
                              )}
                           />
                           {hoveredEl}
                        </>
                     );
                  })}
            </CategoryDisplay>
         ))}
      </HomeLayout>
   );
};

export default Home;

export const getServerSideProps = async () => {
   const maxResultNumber = 6;
   const data: CategoriesQueries = {};
   // const data: CategoriesDataParams = {};

   // the caveat here is the number of calls to google book api
   // however given that this application is not to scale this should be fine
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

   return {
      props: { data },
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
