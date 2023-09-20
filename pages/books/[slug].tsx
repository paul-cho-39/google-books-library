import { getSession } from 'next-auth/react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import googleApi from '../../models/_api/fetchGoogleUrl';
import { lazy } from 'react';
import filterBookInfo, { FilteredVolumeInfo } from '../../lib/helper/books/filterBookInfo';
import { Items, Pages, SingleBook } from '../../lib/types/googleBookTypes';
import { fetcher } from '../../utils/fetchData';
import { handleNytId } from '../../lib/helper/books/handleIds';
import BookImage from '../../components/bookcover/bookImages';
import { getBookWidth } from '../../utils/getBookWidth';
import BookTitle from '../../components/bookcover/title';
import SingleOrMultipleAuthors from '../../components/bookcover/authors';
import BookDescription from '../../components/bookcover/description';
import BookPublisher from '../../components/bookcover/publisher';
import BookDetails from '../../components/bookcover/bookDetails';
import SignInRequiredButton from '../../components/Login/requireUser';
import { CustomSession } from '../../lib/types/serverPropsTypes';
import { useRouter } from 'next/router';

const HEIGHT = 225;

const SaveAsFinishedButton = lazy(() => import('./../../components/bookcards/finishedButton'));
const PopOverButtons = lazy(() => import('./../../components/bookcards/popover/popoverButtons'));

// whenever a key is applied it does not seem to work?
export default function BookPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const { id, book, userId } = props;
   const data = filterBookInfo(book);

   const router = useRouter();
   const fromPage = router.query.from;
   // write a helper function to detail where it is coming from

   // NOT only want useGetBookData but also data that is needed to fill
   // in here which are analytics of the book

   // TODO: create an error boundary page
   return (
      <div className='mx-auto w-full min-h-screen overflow-y-auto dark:bg-slate-800'>
         <div className='w-full flex flex-col max-w-2xl items-center justify-center py-2 lg:grid lg:grid-cols-3 lg:max-w-4xl'>
            <div className='flex flex-col items-center justify-center lg:col-span-1 lg:gap-x-0'>
               <BookImage
                  hidden={true}
                  bookImage={data.imageLinks}
                  title={data.title as string}
                  height={HEIGHT}
                  width={getBookWidth(HEIGHT)}
                  priority
                  className=''
               />
               <div className='flex flex-row w-full py-4 items-center justify-center'>
                  <SignInRequiredButton
                     type='finished'
                     userId={userId}
                     signedInActiveButton={
                        <SaveAsFinishedButton book={book} userId={userId as string} />
                     }
                  />
                  <SignInRequiredButton
                     type='popover'
                     userId={userId}
                     signedInActiveButton={<PopOverButtons book={book} userId={userId as string} />}
                  />
               </div>
            </div>
            <div className='flex flex-col justify-start px-2 gap-y-2 lg:col-span-2'>
               <BookTitle
                  id={id}
                  hasLink={false}
                  title={data.title as string}
                  subtitle={data.subtitle}
                  className='text-xl mb-2 lg:mb-4 lg:text-3xl'
               />
               <div className='mb-1 lg:mb-1 not-first:underline not-first:underline-offset-2 text-slate-800 dark:text-slate-100'>
                  <span className=''>By: </span>
                  <SingleOrMultipleAuthors authors={data.authors} />
               </div>
               <BookPublisher
                  date={data.publishedDate}
                  className='mb-1 lg:mb-1 text-md dark:text-slate-100'
               />
               <BookDetails
                  categories={data.categories}
                  page={data.pageCount}
                  publisher={data.publisher}
                  language={data.language}
                  infoLinks={data.infoLink}
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
               description={data.description}
               descriptionLimit={250}
               textSize='text-lg'
               isLink={false}
               href={''}
            />
         </div>
      </div>
   );
}

// the tradeoff b/w fetching from the cached result and requesting new data
// are :
// a) resolution of the image. It is much lower and only have 'smallThumbnail'
// b) less defined cateogires
// c)
export const getServerSideProps: GetServerSideProps<{
   // data: Partial<FilteredVolumeInfo>;
   book: Items<any>;
   id: string;
   userId: string | null;
}> = async (context: any) => {
   const { slug } = context.query as { slug: string };
   let id: string;
   let source: string;

   const session = await getSession(context);
   const user = session?.user as CustomSession;
   const userId = user?.id || null;

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
         userId: userId,
         book: book,
         // data: filterBookInfo(book),
         id: slug, // pass the original id
      },
   };
};
