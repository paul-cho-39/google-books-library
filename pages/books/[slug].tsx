import { getSession } from 'next-auth/react';
import getUserId from '../../lib/helper/getUserId';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import googleApi from '../../models/_api/fetchGoogleUrl';
import { useEffect } from 'react';
import filterBookInfo, { FilteredVolumeInfo } from '../../lib/helper/books/filterBookInfo';
import queryKeys from '../../lib/queryKeys';
import { Pages, SingleBook } from '../../lib/types/googleBookTypes';
import BookCover from '../../components/bookcover/bookCover';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../../utils/fetchData';
import { handleNytId } from '../../lib/helper/books/handleIds';
import BookImage from '../../components/bookcover/bookImages';
import { getBookWidth } from '../../utils/getBookWidth';
import BookTitle from '../../components/bookcover/title';
import SingleOrMultipleAuthors from '../../components/bookcover/authors';
import BookDescription from '../../components/bookcover/description';
import Categories from '../../components/bookcover/categories';
import BookPublisher from '../../components/bookcover/publisher';

const HEIGHT = 200;
// whenever a key is applied it does not seem to work?
export default function BookPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const { id, data } = props;
   const router = useRouter();
   console.log('book data is: ', data);

   // create a separate goolge for this(?);
   const { data: bookData } = useQuery<SingleBook>(
      queryKeys.singleBook(id),
      () => fetcher(googleApi.getUrlByBookId(id)),
      {
         initialData: data,
      }
   );

   // NOT only want useGetBookData but also data that is needed to fill
   // in here which are analytics of the book

   return (
      <div className='mx-auto w-full min-h-screen overflow-y-auto dark:bg-slate-800'>
         <div className='bg-red-500 w-full flex flex-col max-w-lg px-2 py-2 lg:grid lg:grid-cols-4 lg:max-w-5xl'>
            <div className='flex flex-col items-center justify-center lg:col-span-1 lg:justify-start lg:items-start bg-yellow-100'>
               <BookImage
                  bookImage={data.imageLinks}
                  title={data.title as string}
                  height={HEIGHT}
                  width={getBookWidth(HEIGHT)}
                  priority
               />
            </div>
            <div className='flex flex-col justify-start gap-y-2 lg:col-span-2'>
               <BookTitle
                  id={id}
                  hasLink={false}
                  title={data.title as string}
                  subtitle={data.subtitle}
                  className='text-xl lg:text-3xl bg-blue-100 '
               />
               <div className='not-first:underline not-first:underline-offset-2 text-slate-800 dark:text-slate-100'>
                  <span className=''>By: </span>
                  <SingleOrMultipleAuthors authors={data.authors} />
               </div>
               <BookPublisher date={data.publishedDate} className='text-md dark:text-slate-100' />
               {/* create another component */}
               <div></div>
            </div>
         </div>
         <div role='contentinfo' id='book-info' className='my-4 w-full'>
            <h3 className='text-xl lg:text-2xl underline underline-offset-1 text-slate-700 dark:text-slate-200'>
               Descriptions
            </h3>
            <BookDescription
               description={data.description}
               descriptionLimit={300}
               textSize='text-lg'
               isLink={false}
               href={''}
            />
            <Categories categories={data.categories} />
         </div>
      </div>
   );
}

export const getServerSideProps: GetServerSideProps<{
   data: Partial<FilteredVolumeInfo>;
   id: string;
}> = async (context: any) => {
   const { slug } = context.query as { slug: string };
   let id: string;
   let source: string;

   if (slug.includes(handleNytId.suffix)) {
      id = handleNytId.removeSuffix(slug);
      source = 'nyt';
   } else {
      id = slug;
      source = 'google';
   }

   // if nyd can also use nyd book image but for now
   // can just fetch the google because of api limitation
   const book =
      source === 'google'
         ? await fetcher(googleApi.getUrlByBookId(id))
         : await fetcher(googleApi.getUrlByIsbn(id));

   return {
      props: {
         // book: filteredBook,
         data: filterBookInfo(book),
         id: slug, // pass the original id
      },
   };
};
