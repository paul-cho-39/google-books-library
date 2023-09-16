import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import { CustomSession } from '../../lib/types/serverPropsTypes';
import googleApi from '../../models/_api/fetchGoogleUrl';
import { fetcher } from '../../utils/fetchData';
import { Pages } from '../../lib/types/googleBookTypes';
import useGetCategoryQuery from '../../lib/hooks/useGetCategoryQuery';
import { Categories } from '../../constants/categories';

export default function BookCategoryPages({
   category,
   pageIndex,
   userId,
   data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const books = useGetCategoryQuery(data, category);
   //    if nyt fiction / nonfiction return those books too?

   console.log('books data are: ', books);

   return (
      <div>
         {/* component here */}
         <article>
            <h3>New Released {category as string} Books</h3>
            <div></div>
         </article>

         {/* another component here */}
         <article>
            <h3>More</h3>
            <div>Load more..</div>
         </article>

         <div></div>
      </div>
   );
}

// retrieve categories in their library and see whether the library
// can it retrieve new released?
// is inside the cateogry that is being clicked
//

export const getServerSideProps: GetServerSideProps<{
   category: Categories;
   pageIndex: number;
   userId: string | null;
   data: Pages<Record<string, string>>;
}> = async (context: any) => {
   const category = context.query.slug;

   const session = await getSession(context);
   const user = session?.user as CustomSession;
   const userId = user?.id || null;

   const pageIndex = Math.floor(Math.random() * 5) + 1;

   const url = googleApi.getUrlBySubject(category, {
      maxResultNumber: 15,
      pageIndex: pageIndex,
      byNewest: true,
   });

   const data = await fetcher(url);

   return {
      props: {
         category,
         pageIndex,
         userId: userId,
         data: data || null,
      },
   };
};
