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
import { ActiveRating } from '@/components/rating/activeRating';
import useHandleRating from '@/lib/hooks/useHandleRating';
import BookActionButton from '@/components/buttons/bookActionButton';
import PageLayout from '@/components/layout/page/bookPageLayout';
import useSearchFilter from '@/lib/hooks/useSearchFilter';

import type { NextPageWithLayout } from './../_app';
import DescriptionSection from '@/components/contents/books/description';
import ReviewSection from '@/components/contents/books/review';
import getUserInfo from '@/lib/helper/getUserId';
import { BookTopLayout, BookBottomLayout } from '@/components/layout/bookLayout';
import { string } from 'prop-types';

const HEIGHT = 225;

const BookMetaDescriptionSection = lazy(
   () => import('@/components/section/bookDescriptionSection')
);

// when refreshed the serversideProps will fetch the data
// when navigating between pages and coming back useQuery to check
const BookPage: NextPageWithLayout<
   InferGetServerSidePropsType<typeof getServerSideProps> & { isLoading: boolean; title: string }
> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
   const { id, user, placerData } = props;

   const { userId, photoUrl } = getUserInfo(user);

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

   console.log('---------INSIDE THE MAIN PAGE-----------');
   // console.log('For the book', id, 'THE SELECTED RATING IS: ', selectedRating);
   // console.log('USER RATING DATA', id, '(not useState but the value for) IS: ', selectedRating);
   console.log('IS THE BOOK IN LIBRARY AFTER THE COMMENT?: ', allRatingData);
   console.log('THE DATA SHOULD BE DEFINED: ', data);

   // ALTER THIS IF THE LIBRARY DOES NOT CHANGE
   const params = {
      bookId: id,
      userId: userId as string,
      inLibrary: allRatingData?.inLibrary!,
   };

   const { handleMutation, handleRemoveMutation, currentRatingData } = useHandleRating(
      {
         // bookId: id,
         // userId: userId as string,
         // inLibrary: allRatingData?.inLibrary!,
         ...params,
         prevRatingData: userRatingData,
      },
      data,
      allRatingData
   );

   const ratingTitle = !userRatingData ? 'Rate this book' : 'Rating saved';

   return (
      <PageLayout isLoading={isLoading} title={data?.volumeInfo?.title}>
         <BookTopLayout>
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
                     <BookActionButton
                        className='justify-center px-2'
                        book={data}
                        userId={userId as string}
                     />
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
               <BookMetaDescriptionSection
                  allRatingData={allRatingData}
                  data={data}
                  userId={userId}
               />
            </Suspense>
         </BookTopLayout>
         <BookBottomLayout>
            <DescriptionSection description={data?.volumeInfo?.description} />
            <ReviewSection avatarUrl={photoUrl} params={params} bookData={data} />
         </BookBottomLayout>
      </PageLayout>
   );
};

export const getServerSideProps: GetServerSideProps<RateServerTypes> = async (context) => {
   const { slug: bookId } = context.query as { slug: string };

   const session = await getSession(context);
   // const user = session?.user as CustomSession;
   // const userId = user?.id || null;

   const service = new BookService();
   const data = (await service.getAllRatingOfSingleBook(
      bookId
   )) as unknown as MultipleRatingData | null;

   // refines the date so it can be returned inside the SSR
   const refinedData = refiner.refineDates<MultipleRatingData | null>(data);

   return {
      props: {
         user: session,
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
