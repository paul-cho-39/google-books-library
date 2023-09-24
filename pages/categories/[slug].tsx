import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getSession } from 'next-auth/react';
import { fetchDataFromCache, fetcher, getAbsoluteUrl } from '../../utils/fetchData';

import useGetCategoryQuery from '../../lib/hooks/useGetCategoryQuery';
import useGetNytBestSeller from '../../lib/hooks/useGetNytBestSeller';
import useHoverDisplayDescription from '../../lib/hooks/useHoverDisplay';

import {
   CategoriesQueries,
   CategoryQuery,
   CustomSession,
   ReturnedCacheData,
} from '../../lib/types/serverPropsTypes';
import { GoogleUpdatedFields, ImageLinks, Items, Pages } from '../../lib/types/googleBookTypes';
import { Categories, categories } from '../../constants/categories';
import { CategoryQualifiers } from '../../models/_api/fetchNytUrl';
import { capitalizeWords } from '../../utils/transformChar';
import {
   CategoryGridLarge,
   CategoryGridSmall,
} from '../../components/contents/category/categoryGrids';
import { BookImageSkeleton, DescriptionSkeleton } from '../../components/loaders/bookcardsSkeleton';
import { getBookWidth, getContainerWidth } from '../../utils/getBookWidth';
import classNames from 'classnames';
import { useDisableBreakPoints } from '../../lib/hooks/useDisableBreakPoints';
import { changeDirection } from '../../utils/reverseDescriptionPos';
import routes from '../../constants/routes';
import { handleNytId } from '../../utils/handleIds';
import { Divider } from '../../components/layout/dividers';
import BookTitle from '../../components/bookcover/title';
import SingleOrMultipleAuthors from '../../components/bookcover/authors';
import layoutManager from '../../constants/layouts';
import { batchFetchGoogleCategories } from '../../models/cache/handleGoogleCache';
import { useRouter } from 'next/router';
import BookLoader from '../../components/loaders/spinner';

const CategoryDescription = lazy(
   () => import('../../components/contents/home/categoryDescription')
);
const BookImage = lazy(() => import('../../components/bookcover/bookImages'));

const MAX_ITEMS = 15;

export default function BookCategoryPages({
   category,
   data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
   const [currentPage, setCurrentPage] = useState(0);

   const router = useRouter();
   // const { category } = router.query;

   const enableNytData = category === 'fiction' || category === 'nonfiction';

   const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
   };

   const meta = {
      maxResultNumber: MAX_ITEMS,
      pageIndex: currentPage,
      byNewest: true,
   };

   const { data: googleData, cleanedData } = useGetCategoryQuery({
      initialData: data[category] as GoogleUpdatedFields | undefined,
      category: category as Categories,
      enabled: !!data,
      meta: meta,
      keepPreviousData: true,
      route: { source: 'google', endpoint: 'recent' },
   });

   // requring both so that each will have its own publication date?
   const { data: bestSellers, isSuccess } = useGetNytBestSeller({
      category: { format: 'combined-print-and-e-book', type: category } as CategoryQualifiers,
      date: 'current', // the date should be passed(?)
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

            const position = changeDirection(
               el.width,
               isHovered.index,
               5,
               5 - 1,
               layoutManager.categories.padding,
               15
            );

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

   // create a function for this too
   const CATEGORY_NYT_HEADER =
      bestSellers &&
      `${capitalizeWords(category as string)} Best Sellers (${bestSellers.published_date})`;

   const HEIGHT = layoutManager.constants.imageHeight;

   if (router.isFallback) {
      return <div>...Loading</div>;
   }

   return (
      <div className='min-h-screen w-full'>
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
                                 routeQuery={routes.category(category, meta)}
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
                              routeQuery={routes.category(category, meta)}
                           />
                        </Suspense>
                        {hoveredEl}
                     </>
                  );
               })}
            </CategoryGridLarge>
         )}
         {isSuccess && bestSellers && (
            <>
               <Divider />
               <CategoryGridSmall category={CATEGORY_NYT_HEADER}>
                  {bestSellers.books.map((book, index) => (
                     <div className='flex flex-row items-start space-x-2' key={book.primary_isbn13}>
                        <Suspense
                           fallback={<BookImageSkeleton height={HEIGHT} getWidth={getBookWidth} />}
                        >
                           <BookImage
                              id={handleNytId.appendSuffix(book.primary_isbn13)}
                              title={book.title}
                              width={getBookWidth(HEIGHT)}
                              height={HEIGHT}
                              bookImage={book.book_image}
                              priority={false}
                              className={classNames('lg:col-span-1 px-1 lg:px-0 cursor-pointer')}
                              routeQuery={routes.category(category, meta)}
                           />
                        </Suspense>
                        <div className='flex flex-col items-start justify-start w-full'>
                           <h4 className='text-lg dark:text-slate-200'>Rank: {book.rank}</h4>
                           <BookTitle
                              id={handleNytId.appendSuffix(book.primary_isbn13)}
                              title={capitalizeWords(book.title)}
                              routeQuery={routes.category(category, meta)}
                              className='text-lg lg:text-xl hover:underline hover:decoration-orange-400 hover:dark:decoration-orange-200'
                           />
                           <p className='text-sm text-clip space-x-0.5 not-first:text-blue-700 not-first:hover:text-blue-500 not-first:dark:text-blue-400 hover:not-first:underline hover:not-first:decoration-orange-400 hover:not-first:dark:decoration-orange-200'>
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

export const getStaticPaths: GetStaticPaths = async () => {
   const paths = categories.map((category) => ({
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

   const sampleCat = categories.slice(0, 4);

   // change this to categories when testing this out
   const googleData = await batchFetchGoogleCategories(sampleCat, {
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

// export const getServerSideProps: GetServerSideProps<{
//    category: string;
//    userId: string | null;
//    recentlyPublishedData: ReturnedCacheData<GoogleUpdatedFields> | null;
// }> = async ({ req, params, query }) => {
//    let data: ReturnedCacheData<GoogleUpdatedFields> | null;
//    const category = query?.slug as string;

//    const session = await getSession(params);
//    const user = session?.user as CustomSession;
//    const userId = user?.id || null;

//    if (category.toUpperCase() === categories[0]) {
//       data = null;
//    } else {
//       data = await fetchDataFromCache<GoogleUpdatedFields>(category, {
//          source: 'google',
//          endpoint: 'recent',
//          req,
//       });
//    }

//    return {
//       props: {
//          category: category,
//          userId: userId,
//          recentlyPublishedData: data,
//       },
//    };
// };
