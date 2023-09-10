import { getSession } from 'next-auth/react';
import getUserId from '../../lib/helper/getUserId';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import googleApi, { fetcher } from '../../models/_api/fetchGoogleUrl';
import { useEffect } from 'react';
import filterBookInfo from '../../lib/helper/books/filterBookInfo';
import queryKeys from '../../lib/queryKeys';
import { SingleBook } from '../../lib/types/googleBookTypes';
import BookCover from '../../components/bookcover/bookCover';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

// the critical question here is WHAT TO DISPLAY
// which is central on the idea of WHAT THIS PRODUCT IS
// DESIGNED TO DO

export const getServerSideProps: GetServerSideProps<{
   data: SingleBook;
   id: string;
}> = async (context: any) => {
   const { slug: id } = context.query as { slug: string };
   const getBook = await fetcher(googleApi.getUrlByBookId(id));
   const initialData = filterBookInfo(getBook) as unknown as SingleBook;

   // WORKS BUT HAVE THIS SET LATER
   // const getUser = await getSession(context);
   // const userId = getUserId(getUser as object, "id");
   // if (userId) {
   //   return {
   //     redirect: {
   //       destination: `/profile/${userId}/${id}`,
   //       permanent: false,
   //     },
   //   };
   // }
   return {
      props: {
         data: initialData,
         id: id,
      },
   };
};

// whenever a key is applied it does not seem to work?
export default function BookPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const { id, data } = props;
   const router = useRouter();
   console.log(id);
   const { data: bookData } = useQuery<SingleBook>(
      queryKeys.singleBook(id),
      () => fetcher(googleApi.getUrlByBookId(id)),
      {
         initialData: data,
      }
   );
   // const queryClient = useQueryClient();
   // queryClient.refetchQueries(queryKeys.bookSearch(search), { exact: true });
   useEffect(() => {
      console.log('queryData:', bookData);
   }, []);

   // NOT only want useGetBookData but also data that is needed to fill
   // in here which are analytics of the book

   return (
      <div className='bg-white px-2'>
         <button onClick={() => router.back()}>{'<-'}</button>
         <div>
            <BookCover bookData={bookData}>
               {/* the button is there but should make the user log in */}
               {/* if the user is not logged in */}
            </BookCover>
         </div>
      </div>
   );
}
