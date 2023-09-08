import type { InferGetServerSidePropsType, NextPage } from 'next';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getSession } from 'next-auth/react';
import getUserId from '../lib/helper/getUserId';

import Link from 'next/link';
import { ReadingGetter } from '../lib/prisma/class/get/bookgetter';
import useCategoryQuery from '../lib/hooks/useCategoryQuery';
import HomeLayout from '../components/layout/page/home';
import { CategoryDescription, CategoryDisplay } from '../components/home/categories';
import BookImage from '../components/bookcover/bookImages';
import { ImageLinks } from '../lib/types/googleBookTypes';
import classNames from 'classnames';
import { useDisableBreakPoints } from '../lib/hooks/useDisableBreakPoints';

export type CurrentOrReadingProps = InferGetServerSidePropsType<typeof getServerSideProps>;

type HoveredProps = {
   id: string | null;
   hovered: boolean;
   isFloatHovered: boolean;
   index: number | null;
};

const SMALL_SCREEN = 768;
export const HEIGHT = 150;
const PADDING = 8;
export const CONTAINER_HEIGHT = 150;

// the width ratio depends on the size;
const WIDTH_RATIO = 3.2;
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
   const currentIndex =
      itemIndex === totalColumns || itemIndex % totalColumns === 0
         ? totalColumns
         : itemIndex % totalColumns;

   if (currentIndex >= threshold) {
      const mult = totalColumns + 1 - currentIndex;
      console.log('multiplier: ', mult);
      return {
         right: (PADDING + width) * mult,
         left: 0,
      };
   }

   return { left: (PADDING + width) * currentIndex, right: 0 };
};

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
   const { data, userId } = props;
   const education = useCategoryQuery('ART');
   // console.log('here is the result of the data: ', education.data);
   // console.log('--------------------');
   // console.log('the status of data: ', education.status);

   const gridRef = useRef<HTMLDivElement>(null);
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
         imageRefs.current &&
         gridRef.current
      ) {
         const totalWidth = gridRef.current.clientWidth;
         const el = imageRefs.current[isHovered.id]?.getBoundingClientRect();

         if (el) {
            const position = changeDirection(
               totalWidth,
               el.width,
               isHovered.index,
               NUMBER_OF_COLS,
               NUMBER_OF_COLS - 1
            );
            const top = el.top - el.height - 27;

            if (position.right > 0) {
               floatingRef.current.style.right = `${position.right}px`;
               floatingRef.current.style.top = `${top}px`; // have to fix this number;
               floatingRef.current.style.position = 'absolute';
            } else {
               floatingRef.current.style.left = `${position.left}px`;
               floatingRef.current.style.top = `${top}px`; // have to fix this number;
               floatingRef.current.style.position = 'absolute';
            }
         }
      }
   }, [NUMBER_OF_COLS, isHovered]);

   // TESTING
   if (!data) {
      return (
         // "track your data here" w/ link to the book page
         <Link as={`/profile/${userId}/searchbook`} href={`/profile/[id]/searchbook`}></Link>
      );
   }

   return (
      <HomeLayout>
         <CategoryDisplay forwardRef={gridRef} category='EDUCATION'>
            {education &&
               education?.data?.map((book, index) => {
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
                              index % 2 ? 'bg-blue-100' : 'bg-red-100',
                              'col-span-1 cursor-pointer'
                           )}
                        />
                        {hoveredEl}
                     </>
                  );
               })}
         </CategoryDisplay>
      </HomeLayout>
   );
};

export default Home;

// using getServerSideProps to access google api
// and store it in the client side because the data will
// be static(?) and will retrieve by the results to retrieve almost all of the queries
// and prefetch the data

export const getServerSideProps = async (context: any) => {
   const getUser = await getSession(context);
   const userId = getUserId(getUser as object, 'id');
   // const bookGetter = new BookGetter(userId);
   // const data = await bookGetter.getCurrentOrPrimary();

   const getter = new ReadingGetter(userId);
   const data = await getter.getEditPrimaryData();
   return {
      props: {
         userId: userId,
         data: data,
      },
   };
};

// this wont happen with recommended lists or best sellers(?)
// see NYT bestsellers lists for more
