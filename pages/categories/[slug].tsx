import { useQuery } from '@tanstack/react-query';
import googleApi from '../../models/_api/fetchGoogleUrl';
import styles from './../../styles/Home.module.css';
import { InferGetServerSidePropsType } from 'next';
import { Sample } from '../../components/spinner';
import queryKeys from '../../lib/queryKeys';
import nytApi from '../../models/_api/fetchNytUrl';
import { fetcher } from '../../utils/fetchData';

const BookCategories = () =>
   // props: InferGetServerSidePropsType<typeof getServerSideProps>
   {
      // const { data } = props;

      // 1) create a class for nyt to fetch the result and lists
      // 2) possibly create another class that combines the result for google and nyt
      // 3) see what kind of data are connected and data that it can call(?)
      const nytData = useQuery(
         // queryKeys.nytBestSellers('fiction', 'current'),
         ['nytbestseller'],
         async () => {
            const res = await fetcher(
               nytApi.getUrlByCategory({
                  type: 'fiction',
                  // format: 'combined-print-and-e-book',
                  format: 'hardcover',
               }),
               // nytApi.getReviewUrl({
               //    author: 'elaine weiss',
               // }),
               {
                  headers: { 'Content-Type': 'application/json' },
                  method: 'GET',
               }
            );
            return res;
         }
      );
      console.log('the data is successful: ', nytData);
      console.log('the status is: ', nytData.status);
      console.log('the failure reasion is: ', nytData.failureReason);
      console.log('the nytDatad result: ', nytData.data);

      return (
         <>
            <div
               // style={{
               //    display: 'flex',
               //    padding: '12px',
               //    marginRight: '20px',
               // }}
               className={styles.book}
               //  className='bg-slate-100 flex overflow-x-auto space-x-14 border-gray-300 p-4'
            >
               {/* <div className='bg-red-200 px-2 '>Item 1</div>
            <div className='bg-red-200 px-2 '>Item 2</div>
            <div className='bg-red-200 px-2 '>Item 3</div>
            <div className='bg-red-200 px-2 '>Item 4</div>
            <div className='bg-red-200 px-2 '>Item 5</div>
            <div className='bg-red-200 px-2 '>Item 6</div> */}
            </div>
            <Sample />
         </>
      );
   };

export default BookCategories;

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
