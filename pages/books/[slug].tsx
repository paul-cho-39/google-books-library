import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { lazy, useState } from 'react';

import BookImage from '../../components/bookcover/bookImages';
import { getBookWidth } from '../../lib/helper/books/getBookWidth';
import BookTitle from '../../components/bookcover/title';
import SingleOrMultipleAuthors from '../../components/bookcover/authors';
import BookDescription from '../../components/bookcover/description';
import BookPublisher from '../../components/bookcover/publisher';
import BookDetails from '../../components/bookcover/bookDetails';
import SignInRequiredButton from '../../components/Login/requireUser';
import { CustomSession, RateServerTypes } from '../../lib/types/serverPropsTypes';
import { useRouter } from 'next/router';
import useGetBookById from '../../lib/hooks/useGetBookById';
import { CategoryRouteParams, RouteParams } from '../../lib/types/routes';
import APIErrorBoundary from '../../components/error/errorBoundary';
import DisplayRating, { ActiveRating } from '../../components/bookcover/ratings';
import useMutateRatings from '../../lib/hooks/useMutateRatings';
import BookRatings from '../../models/server/prisma/Rating';
import { errorLogger } from '../../models/server/winston';
import { useGetRating } from '../../lib/hooks/useGetRatings';

const HEIGHT = 225;

const SaveAsFinishedButton = lazy(() => import('../../components/buttons/finishedButton'));
const PopOverButtons = lazy(() => import('../../components/buttons/popoverButtons'));
// const Ratings = lazy(() => import('../../components/'));

// whenever a key is applied it does not seem to work?
export default function BookPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const { id, userId, rateData } = props;

   const [selectedRating, setSelectedRating] = useState<number>(0);

   const router = useRouter();
   const query = router.query as CategoryRouteParams | RouteParams;

   const { data, isSuccess, isLoading } = useGetBookById({ routeParams: query });

   // ratings
   const { data: currentRating } = useGetRating({
      bookId: id,
      userId: userId as string,
      initialData: rateData,
   });

   console.log('BEGINNING TO DEBUG HERE: ');
   console.log('-------------------------');
   console.log('-------------------------');
   console.log('-------------------------');
   console.log('-------------------------');
   console.log('data is now: ', currentRating);
   console.log('user data is: ', userId);
   console.log('id is : ', id);

   const { mutate } = useMutateRatings({ bookId: id, userId: userId });

   if (isLoading) {
      return <div>Loading...</div>;
   }

   return (
      <APIErrorBoundary>
         <div className='mx-auto w-full min-h-screen overflow-y-auto dark:bg-slate-800'>
            <div className='w-full flex flex-col max-w-2xl items-center justify-center py-2 md:grid md:grid-cols-3 lg:max-w-4xl'>
               <div className='flex flex-col items-center justify-center md:col-span-1 md:gap-x-0'>
                  <BookImage
                     id={data.id}
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
                     onRatingSelected={mutate}
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
                  <DisplayRating size='large' />
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

   const rater = new BookRatings(userId as string, bookId as string);
   const data = await rater.getRatingByBook();

   console.log('the book Id is: ', bookId);
   console.log('the userID here is: ', userId);

   return {
      props: {
         userId: userId,
         id: bookId, // pass the original id
         ratingData: data,
      },
   };
};
