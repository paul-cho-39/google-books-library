import { useQuery } from '@tanstack/react-query';
import googleApi, { fetcher } from '../../models/_api/fetchGoogleUrl';
import styles from './../../styles/Home.module.css';
import { InferGetServerSidePropsType } from 'next';
import { Sample } from '../../components/spinner';

const BookCategories = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
   const { data } = props;

   // 1) create a class for nyt to fetch the result and lists
   // 2) possibly create another class that combines the result for google and nyt
   useQuery();

   // paginate the result

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

export const getServerSideProps = async (context: any) => {
   const query = context.params.query;
   const url = googleApi.getUrlBySubject(query, {
      maxResultNumber: 20,
      pageIndex: 0,
   });

   const data = await fetcher(url);

   return {
      props: { data },
   };
};
