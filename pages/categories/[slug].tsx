import { useQuery } from '@tanstack/react-query';
import googleApi from '../../models/_api/fetchGoogleUrl';
import styles from './../../styles/Home.module.css';
import { InferGetServerSidePropsType } from 'next';
import { Sample } from '../../components/spinner';
import queryKeys from '../../lib/queryKeys';
import nytApi from '../../models/_api/fetchNytUrl';
import { fetcher } from '../../utils/fetchData';
import useGetNytBestSeller from '../../lib/hooks/useGetNytBestSeller';
import { CategoryDescription, CategoryDisplay } from '../../components/home/categories';
import BookImage from '../../components/bookcover/bookImages';
import Image from 'next/image';

const BookCategories = () =>
   // props: InferGetServerSidePropsType<typeof getServerSideProps>
   {
      // const { data } = props;

      // 1) create a class for nyt to fetch the result and lists
      // 2) possibly create another class that combines the result for google and nyt
      // 3) see what kind of data are connected and data that it can call(?)

      const { data } = useGetNytBestSeller({
         category: { format: 'hardcover', type: 'trade-fiction' },
         date: 'current',
      });

      console.log('the datad result: ', data);

      // next step --
      // 1) correct display of CategoryDisplay
      // 2) book author & image
      // 3) set priority
      return (
         <>
            <CategoryDisplay category='ART'>
               {data?.books.map((book, index) => (
                  <>
                     <BookImage
                        bookImage={book.book_image}
                        title={book.title}
                        height={150}
                        width={115}
                        priority
                     />
                  </>
               ))}
            </CategoryDisplay>
         </>
      );
   };

export default BookCategories;

// if the book is in isbn13 then retrieve the results using isbn from googleApi

// export const getServerSideProps = async (context: any) => {
//    const query = context.params.slug;
//    const url = googleApi.getUrlBySubject(query, {
//       maxResultNumber: 20,
//       pageIndex: 0,
//    });
//    const data = await fetcher(url.replace(' ', ''));

//    return {
//       props: { data },
//    };
// };
