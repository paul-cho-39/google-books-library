import { useQuery } from '@tanstack/react-query';
import googleApi, { fetcher } from '../../lib/helper/books/fetchGoogleUrl';
import { InferGetServerSidePropsType } from 'next';

const BookCategories = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
   const { data } = props;

   // paginate the result

   return <div>This is the category page</div>;
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
