import { ReactElement, Suspense, lazy, useMemo, useState } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

import { getBookWidth } from '@/lib/helper/books/getBookWidth';
import { CustomSession, RateServerTypes, MultipleRatingData } from '@/lib/types/serverTypes';
import useGetBookById from '@/lib/hooks/useGetBookById';
import { CategoryRouteParams, RouteParams } from '@/lib/types/routes';
import { findId, useGetRating } from '@/lib/hooks/useGetRatings';

import refiner, { RefineData } from '@/models/server/decorator/RefineData';
import BookService from '@/models/server/service/BookService';

import BookImage from '@/components/bookcover/bookImages';
import BookDescription from '@/components/bookcover/description';
import { ActiveRating } from '@/components/rating/activeRating';
import useHandleRating from '@/lib/hooks/useHandleRating';
import BookActionButton from '@/components/buttons/bookActionButton';
import PageLayout from '@/components/layout/page/bookPageLayout';
import useSearchFilter from '@/lib/hooks/useSearchFilter';

import type { NextPageWithLayout } from './../_app';

const HEIGHT = 225;

const BookDescriptionSection = lazy(() => import('@/components/section/bookDescriptionSection'));

// when refreshed the serversideProps will fetch the data
// when navigating between pages and coming back useQuery to check
const BookPage: NextPageWithLayout<
   InferGetServerSidePropsType<typeof getServerSideProps> & { isLoading: boolean; title: string }
> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
   const { id, userId, placerData } = props;

   const router = useRouter();
   const { filter } = useSearchFilter(); // returns the current filter
   const query = router.query as CategoryRouteParams | RouteParams;

   const { data, isSuccess, isLoading } = useGetBookById({ routeParams: query, filter: filter });

   // TEST whether multiple users updating will have the same effect for updating
   const { data: allRatingData } = useGetRating({
      bookId: id,
      userId: userId as string,
      initialData: placerData,
   });

   // this is used for initializing the rating
   const userRatingData = useMemo(
      () => findId(allRatingData, userId as string),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [allRatingData]
   );

   // console.log('---------INSIDE THE MAIN PAGE-----------');
   // console.log('INSIDE THE MAIN, the data will be: ', allRatingData);

   // const userRatingData = findId(allRatingData, userId as string);

   const [selectedRating, setSelectedRating] = useState<null | number>(
      userRatingData?.ratingInfo?.ratingValue || 0
   );

   // console.log('---------INSIDE THE MAIN PAGE-----------');
   // console.log('For the book', id, 'THE SELECTED RATING IS: ', selectedRating);
   // console.log('USER RATING DATA', id, '(not useState but the value for) IS: ', selectedRating);

   const { handleMutation, handleRemoveMutation, currentRatingData } = useHandleRating(
      {
         bookId: id,
         userId: userId as string,
         inLibrary: allRatingData?.inLibrary!,
         prevRatingData: userRatingData,
      },
      data,
      allRatingData
   );

   const ratingTitle = !userRatingData ? 'Rate Book' : 'Rating Saved';
   const title = data?.volumeInfo?.title;

   return (
      <PageLayout isLoading={isLoading} title={data?.volumeInfo?.title}>
         <div className='w-full flex flex-col max-w-2xl items-center justify-center p-6 lg:p-10 md:grid md:grid-cols-3 lg:max-w-4xl'>
            <div className='flex flex-col items-center justify-center md:col-span-1 md:gap-x-0'>
               <BookImage
                  id={data?.id}
                  hidden={true}
                  bookImage={data?.volumeInfo?.imageLinks}
                  title={data?.volumeInfo.title as string}
                  height={HEIGHT}
                  width={getBookWidth(HEIGHT)}
                  priority
                  className='justify-center items-center'
               />
               <div className='flex flex-row w-full py-4 items-center justify-center'>
                  {isSuccess && data && (
                     <>
                        <BookActionButton
                           className='justify-center px-2'
                           book={data}
                           userId={userId as string}
                        />
                     </>
                  )}
               </div>
               <ActiveRating
                  ratingTitle={ratingTitle}
                  selectedRating={selectedRating}
                  handleMutation={handleMutation}
                  handleRemoveMutation={handleRemoveMutation}
                  setSelectedRating={setSelectedRating}
                  // display remove rating
                  shouldDisplay={!!userRatingData}
                  userId={userId}
                  router={router}
                  size='large'
               />
            </div>
            <Suspense fallback={<div></div>}>
               <BookDescriptionSection allRatingData={allRatingData} data={data} userId={userId} />
            </Suspense>
         </div>
         <div
            role='contentinfo'
            id='book-info'
            className='my-4 w-full max-w-2xl py-2 px-2 lg:max-w-5xl lg:px-6 xl:px-12 lg:my-12'
         >
            <h3 className='text-xl lg:text-2xl underline underline-offset-1 text-slate-700 dark:text-slate-200 lg:mb-4'>
               Descriptions
            </h3>
            <BookDescription
               description={data?.volumeInfo.description}
               descriptionLimit={250}
               textSize='text-lg'
               isLink={false}
               href={''}
            />
         </div>
      </PageLayout>
   );
};

export const getServerSideProps: GetServerSideProps<RateServerTypes> = async (context) => {
   const { slug: bookId } = context.query as { slug: string };

   const session = await getSession(context);
   const user = session?.user as CustomSession;
   const userId = user?.id || null;

   const service = new BookService();
   const data = (await service.getAllRatingOfSingleBook(
      bookId
   )) as unknown as MultipleRatingData | null;

   // refines the date so it can be returned inside the SSR
   const refinedData = refiner.refineDates<MultipleRatingData | null>(data);

   return {
      props: {
         userId: userId,
         id: bookId,
         placerData: refinedData,
      },
   };
};

BookPage.getLayout = function getLayout(page: ReactElement) {
   const { isLoading, title } = page.props as { isLoading: boolean; title: string };

   return (
      <PageLayout isLoading={isLoading} title={title}>
         {page}
      </PageLayout>
   );
};

export default BookPage;
