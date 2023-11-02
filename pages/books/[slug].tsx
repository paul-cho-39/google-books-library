import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { lazy, useEffect, useMemo, useState } from 'react';

import BookImage from '@/components/bookcover/bookImages';
import { getBookWidth } from '@/lib/helper/books/getBookWidth';
import BookTitle from '@/components/bookcover/title';
import SingleOrMultipleAuthors from '@/components/bookcover/authors';
import BookDescription from '@/components/bookcover/description';
import BookPublisher from '@/components/bookcover/publisher';
import BookDetails from '@/components/bookcover/bookDetails';
import SignInRequiredButton from '@/components/Login/requireUser';
import { CustomSession, RateServerTypes, MultipleRatingData } from '@/lib/types/serverTypes';
import { useRouter } from 'next/router';
import useGetBookById from '@/lib/hooks/useGetBookById';
import { CategoryRouteParams, RouteParams } from '@/lib/types/routes';
import APIErrorBoundary from '@/components/error/errorBoundary';
import DisplayRating from '@/components/bookcover/ratings';
import { useMutateCreateRatings, useMutateUpdateRatings } from '@/lib/hooks/useMutateRatings';
import { findId, useGetRating } from '@/lib/hooks/useGetRatings';
import { getBody, getBodyFromFilteredGoogleFields } from '@/lib/helper/books/getBookBody';
import refiner, { RefineData } from '@/models/server/decorator/RefineData';
import { getAverageRatings, getServerAverage, getTotalRatings } from '@/lib/helper/getRating';
import BookService from '@/models/server/service/BookService';
import { ActiveRating } from '@/components/rating/activeRating';

const HEIGHT = 225;

const SaveAsFinishedButton = lazy(() => import('@/components/buttons/finishedButton'));
const PopOverButtons = lazy(() => import('@/components/buttons/popoverButtons'));
// const Ratings = lazy(() => import('@/components/'));

// when refreshed the serversideProps will fetch the data
// when navigating between pages and coming back useQuery to check
export default function BookPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const { id, userId, placerData } = props;

   const router = useRouter();
   const query = router.query as CategoryRouteParams | RouteParams;

   const { data, isSuccess, isLoading } = useGetBookById({ routeParams: query });

   // TEST whether multiple users updating will have the same effect for updating
   const { data: currentRatingData } = useGetRating({
      bookId: id,
      userId: userId as string,
      initialData: placerData,
   });

   const userRatingData = useMemo(
      () => findId(currentRatingData, userId as string),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [currentRatingData]
   );

   const { mutate: mutateCreate } = useMutateCreateRatings({
      bookId: id,
      userId: userId as string,
      initialData: userRatingData,
   });

   const {
      mutation: { mutate: mutateUpdate },
      currentRatingData: currentRating,
   } = useMutateUpdateRatings({
      bookId: id,
      userId: userId as string,
      initialData: userRatingData,
   });

   const [selectedRating, setSelectedRating] = useState<null | number>(
      userRatingData?.ratingInfo?.ratingValue ?? null
   );

   console.log('ARE THE BOOKS CREATED?: ', currentRatingData && !currentRatingData.inLibrary);
   const handleMutation = (rating: number) => {
      const notCreated = currentRatingData && !currentRatingData.inLibrary;
      const bookData = getBodyFromFilteredGoogleFields(data);
      const body = { bookData, rating };
      notCreated ? mutateCreate(body) : mutateUpdate(rating);
   };

   // TEST: NO NEED TO CALCULATE THE SERVER TOTAL
   // set this in another function
   const [avgRating, totalRatings] = useMemo(() => {
      const googleTotal = data?.volumeInfo?.totalReviews || 0;
      const googleAvg = data?.volumeInfo?.averageRating || 0;

      const totalRatings = getTotalRatings(currentRatingData?.count || 0, googleTotal);
      const avgRating = getAverageRatings(
         currentRating?.avg || 0,
         currentRating?.count || 0,
         googleAvg,
         googleTotal
      );

      return [avgRating, totalRatings];
   }, [currentRating]);

   const ratingTitle = !userRatingData ? 'Rate Book' : 'Rating Saved';
   // console.log('MUTATION DATA IS: ', currentRatingData);
   // console.log('userRating data is: ', userRatingData);

   if (isLoading) {
      return <div>Loading...</div>;
   }

   return (
      <APIErrorBoundary>
         <div className='mx-auto w-full min-h-screen overflow-y-auto dark:bg-slate-800'>
            <div className='w-full flex flex-col max-w-2xl items-center justify-center py-2 md:grid md:grid-cols-3 lg:max-w-4xl'>
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
                           <SignInRequiredButton
                              type='finished'
                              userId={userId}
                              signedInActiveButton={
                                 <SaveAsFinishedButton book={data} userId={userId as string} />
                              }
                           />
                           <SignInRequiredButton
                              type='popover'
                              userId={userId}
                              signedInActiveButton={
                                 <PopOverButtons book={data} userId={userId as string} />
                              }
                           />
                        </>
                     )}
                  </div>
                  <ActiveRating
                     ratingTitle={ratingTitle}
                     // onRatingSelected={handleMutation}
                     selectedRating={selectedRating}
                     setSelectedRating={setSelectedRating}
                     size='large'
                  />
               </div>
               <div className='flex flex-col justify-start px-2 gap-y-2 md:col-span-2'>
                  <BookTitle
                     id={id}
                     hasLink={false}
                     title={data?.volumeInfo.title as string}
                     subtitle={data?.volumeInfo.subtitle}
                     className='text-xl mb-1 lg:text-3xl'
                  />
                  <div className='mb-1'>
                     <span className='text-slate-800 dark:text-slate-200'>By: </span>
                     <SingleOrMultipleAuthors
                        hoverUnderline={true}
                        authors={data?.volumeInfo.authors}
                     />
                  </div>
                  <BookPublisher
                     date={data?.volumeInfo.publishedDate}
                     className='mb-1 lg:mb-1 text-md dark:text-slate-100'
                  />
                  <DisplayRating
                     totalReviews={totalRatings}
                     averageRating={avgRating}
                     size='large'
                  />
                  <BookDetails
                     categories={data?.volumeInfo.categories}
                     page={data?.volumeInfo.pageCount}
                     publisher={data?.volumeInfo.publisher}
                     language={data?.volumeInfo.language}
                     infoLinks={data?.volumeInfo.infoLink}
                     className='px-6 py-4 md:py-8 lg:py-12'
                  />
               </div>
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
         </div>
      </APIErrorBoundary>
   );
}

export const getServerSideProps: GetServerSideProps<RateServerTypes> = async (context) => {
   const { slug: bookId } = context.query as { slug: string };

   const session = await getSession(context);
   const user = session?.user as CustomSession;
   const userId = user?.id || null;

   const service = new BookService();
   const data = (await service.getAllRatingOfSingleBook(
      bookId
   )) as unknown as MultipleRatingData | null;

   const refinedData = refiner.refineDates<MultipleRatingData | null>(data);

   return {
      props: {
         userId: userId,
         id: bookId,
         placerData: refinedData,
      },
   };
};
