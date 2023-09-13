import { useQuery } from '@tanstack/react-query';
import googleApi from '../../models/_api/fetchGoogleUrl';
import styles from './../../styles/Home.module.css';
import { InferGetServerSidePropsType } from 'next';
import { Sample } from '../../components/spinner';
import queryKeys from '../../lib/queryKeys';
import nytApi, { CategoryQualifiers } from '../../models/_api/fetchNytUrl';
import { fetcher } from '../../utils/fetchData';
import useGetNytBestSeller, { useGetNytBestSellers } from '../../lib/hooks/useGetNytBestSeller';
import { CategoryDescription, CategoryDisplay } from '../../components/home/categories';
import BookImage from '../../components/bookcover/bookImages';
import Image from 'next/image';
import { BestSellerData, ReviewData } from '../../lib/types/nytBookTypes';
import { CategoriesNytQueries, InferServerSideProps } from '../../lib/types/serverPropsTypes';
import SideNavigation from '../../components/headers/sidebar';
import HomeLayout from '../../components/layout/page/home';

const BookCategories = (props: InferServerSideProps) => {
   const { bestSellerData } = props;
   const bestSellers = useGetNytBestSellers({ initialData: bestSellerData });

   console.log('this is the data with keys: ', bestSellers.dataWithKeys);
   console.log('this is the data with just data: ', bestSellers.data);
   console.log('TRANSFORMED DATA', bestSellers.transformedData);

   // 1) create a class for nyt to fetch the result and lists
   // 2) possibly create another class that combines the result for google and nyt
   // 3) see what kind of data are connected and data that it can call(?)

   const { data } = useGetNytBestSeller({
      category: { format: 'hardcover', type: 'trade-fiction' },
      date: 'current',
   });

   // next step --
   // 1) correct display of CategoryDisplay
   // 2) book author & image
   // 3) set priority
   // 4) change category
   return (
      <HomeLayout>
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
      </HomeLayout>
   );
};

export default BookCategories;

// if adding context.params.meta to something like
// new york times or google books or ways to retrieve that data
// can just see which one to fetch here;
// if the book is in isbn13 then retrieve the results using isbn from googleApi

export const getServerSideProps = async (context: any) => {
   // const query = context.params.slug;
   // const url = googleApi.getUrlBySubject(query, {
   //    maxResultNumber: 20,
   //    pageIndex: 0,
   // });
   // const data = await fetcher(url.replace(' ', ''));

   // return {
   //    props: { data },
   // };
   const bestSellerData: CategoriesNytQueries = {};
   const promises = ['fiction', 'nonfiction'].map(async (key) => {
      const url = nytApi.getUrlByCategory({
         format: 'combined-print-and-e-book',
         type: key as CategoryQualifiers['type'],
      });
      const json = (await fetcher(url)) as ReviewData<BestSellerData>;
      bestSellerData[key] = {
         ...json.results,
         books: json.results.books.slice(0, 6),
      };
   });

   await Promise.all(promises);

   return {
      props: {
         bestSellerData,
      },
   };
};
