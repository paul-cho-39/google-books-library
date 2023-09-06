import type { InferGetServerSidePropsType, NextPage } from 'next';
import { useState } from 'react';
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

export type CurrentOrReadingProps = InferGetServerSidePropsType<typeof getServerSideProps>;

// TODO //
// welcoming sign with username

// POSSIBILITY //
// if the user is reading the page is redirected to timer page
const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
   const { data, userId } = props;
   const education = useCategoryQuery('ART');
   console.log('here is the result of the data: ', education.data);
   console.log('--------------------');
   console.log('the status of data: ', education.status);

   const [dateValue, setDateValue] = useState<Date>(new Date());

   // TESTING
   if (!data) {
      return (
         // "track your data here" w/ link to the book page
         <Link as={`/profile/${userId}/searchbook`} href={`/profile/[id]/searchbook`}></Link>
      );
   }

   return (
      <Container className='bg-red-500 h-full'>
         <div className='mx-5 text-center font-teritary'>Hello React</div>
         <ul role='list'>
            {/* start with no data */}
            <h3>Select the main book</h3>
            {/* <BookCards data={data} userId={userId} /> */}
         </ul>
      </Container>
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
