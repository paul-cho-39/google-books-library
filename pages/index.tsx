import type { InferGetServerSidePropsType, NextPage } from 'next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getSession } from 'next-auth/react';
import getUserId from '../lib/helper/getUserId';
import { useQuery } from '@tanstack/react-query';
import queryKeys from '../lib/queryKeys';
import bookApiUpdate from '../lib/helper/books/bookApiUpdate';
// import { BookGetter } from '../lib/prisma/class/bookGetter';
import Link from 'next/link';
import BookCards from '../components/home/bookCards';
import { ReadingGetter } from '../lib/prisma/class/get/bookgetter';
import fetcher from '../lib/helper/books/fetchGoogleUrl';
import useCategoryQuery from '../lib/hooks/useCategoryQuery';
import Container from '../components/layout/container';
import HomeLayout from '../components/layout/page/home';
import { CategoryDescription, CategoryDisplay } from '../components/home/basicCards';
import BookImage from '../components/bookcover/bookImages';
import { ImageLinks } from '../lib/types/googleBookTypes';

export type CurrentOrReadingProps = InferGetServerSidePropsType<typeof getServerSideProps>;

type HoveredProps = { id: string | null; hovered: boolean; isFloatHovered: boolean };

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
   const { data, userId } = props;
   const education = useCategoryQuery('ART');
   // console.log('here is the result of the data: ', education.data);
   // console.log('--------------------');
   // console.log('the status of data: ', education.status);

   const floatingRef = useRef<HTMLDivElement>(null);
   const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});
   const [dateValue, setDateValue] = useState<Date>(new Date());

   // make this into a hook
   const [isHovered, setIsHovered] = useState<HoveredProps>({
      id: null,
      hovered: false,
      isFloatHovered: false,
   });
   const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout>(null!);

   const setImageRef = useCallback((id: string, el: HTMLDivElement | null) => {
      if (imageRefs.current) imageRefs.current[id] = el;
   }, []);

   const onMouseEnter = (id: string) => {
      if (!id) return;
      clearTimeout(hoverTimer);
      setHoverTimer(
         setTimeout(() => {
            setIsHovered({ id, hovered: true, isFloatHovered: false });
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
         setIsHovered({ id: null, hovered: false, isFloatHovered: false });
      }
   };

   const onMouseLeaveDescription = () => {
      clearTimeout(hoverTimer);
      if (isHovered.id !== null) {
         setIsHovered({ id: null, hovered: false, isFloatHovered: false });
      }
   };

   useEffect(() => {
      if (isHovered.id && isHovered.hovered && floatingRef.current && imageRefs.current) {
         const el = imageRefs.current[isHovered.id]?.getBoundingClientRect();

         if (el) {
            const offsetWidth = el.width + 16 + 24 - 10; // px-4 and gap-x-6;
            floatingRef.current.style.position = 'absolute';
            floatingRef.current.style.left = `${el.right - offsetWidth}px`;
            floatingRef.current.style.top = `${0}px`; // have to fix this number;
            floatingRef.current.style.height = `${el.height}px`;
         }
      }
   }, [isHovered, imageRefs, floatingRef]);

   // separate the grid, if (TOTAL_NUMBER_OF_GRID / 3) < x ? 'show_left' : 'show_right';

   // TESTING
   if (!data) {
      return (
         // "track your data here" w/ link to the book page
         <Link as={`/profile/${userId}/searchbook`} href={`/profile/[id]/searchbook`}></Link>
      );
   }

   return (
      <HomeLayout>
         <CategoryDisplay category='EDUCATION'>
            {education &&
               education?.data?.map((book) => {
                  const hoveredEl = isHovered.id == book.id &&
                     (isHovered.hovered || isHovered.isFloatHovered) && (
                        <div
                           ref={floatingRef}
                           itemID='descriptionIdentifier'
                           onMouseLeave={onMouseLeaveDescription}
                           className='absolute z-50 bg-slate-100 w-20 lg:w-64 xl:w-72'
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
                           width={120}
                           height={180}
                           forwardedRef={(el: HTMLDivElement) => setImageRef(book.id, el)}
                           title={book.volumeInfo.title}
                           onMouseEnter={() => onMouseEnter(book.id)}
                           onMouseLeave={(e: React.MouseEvent) => onMouseLeave(e)}
                           className='col-span-1 cursor-pointer'
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
