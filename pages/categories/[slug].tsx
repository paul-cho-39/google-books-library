import { Suspense, lazy, useCallback, useEffect, useRef } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import googleApi from '../../models/_api/fetchGoogleUrl';
import { fetcher } from '../../utils/fetchData';

import useGetCategoryQuery from '../../lib/hooks/useGetCategoryQuery';
import useGetNytBestSeller from '../../lib/hooks/useGetNytBestSeller';

import { CustomSession } from '../../lib/types/serverPropsTypes';
import { ImageLinks, Pages } from '../../lib/types/googleBookTypes';
import { Categories } from '../../constants/categories';
import { CategoryQualifiers } from '../../models/_api/fetchNytUrl';
import { capitalizeWords } from '../../utils/transformChar';
import { CategoryDisplay } from '../../components/contents/home/categories';
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

const SMALL_SCREEN = 768;
const PADDING = 1; // have to add margin from the components
const WIDTH_RATIO = 3.2;
const HEIGHT = 150;
const CONTAINER_HEIGHT = 150; // may subject to change

const CategoryDescription = lazy(
   () => import('../../components/contents/home/categoryDescription')
);
const BookImage = lazy(() => import('../../components/bookcover/bookImages'));

export default function BookCategoryPages({
   category,
   userId,
   recentlyPublishedData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const { data: googleData } = useGetCategoryQuery({
      initialData: recentlyPublishedData,
      category: category as Categories,
      enabled: !!recentlyPublishedData,
   });

   // working with nyt data
   const enableNytData = category === 'fiction' || category === 'nonfiction';

   const topList = useGetNytBestSeller({
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
            const currentIdx = isHovered.index;
            const row = Math.floor(currentIdx / 5);
            const height = el.top / (row + 1);
            const top = height * row;

            const position = changeDirection(el.width, isHovered.index, 5, 5 - 1, PADDING);

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

   console.log('the current top list data is: ', topList.data);

   return (
      <div>
         <CategoryGridLarge category={`New ${capitalizeWords(category as string)} Releases`}>
            <>
               {googleData.map((book, index) => {
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
            </>
         </CategoryGridLarge>
         <CategoryGridSmall category={`${capitalizeWords(category as string)} Best Sellers`}>
            <>
               <div>Hello</div>
               <div>Hello</div>
               <div>Hello</div>
            </>
         </CategoryGridSmall>
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
      maxResultNumber: 15,
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
