import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession } from 'next-auth/react';
import { CustomSession } from '../../lib/types/serverPropsTypes';
import googleApi from '../../models/_api/fetchGoogleUrl';
import { fetcher } from '../../utils/fetchData';
import { Pages } from '../../lib/types/googleBookTypes';
import useGetCategoryQuery from '../../lib/hooks/useGetCategoryQuery';
import { Categories } from '../../constants/categories';
import useGetNytBestSeller from '../../lib/hooks/useGetNytBestSeller';
import { CategoryQualifiers } from '../../models/_api/fetchNytUrl';
import { capitalizeWords } from '../../utils/transformChar';
import { CategoryDisplay } from '../../components/contents/home/categories';
import useHoverDisplayDescription from '../../lib/hooks/useHoverDisplay';
import {
   CategoryGridLarge,
   CategoryGridSmall,
} from '../../components/contents/category/categoryGridLarge ';

export default function BookCategoryPages({
   category,
   userId,
}: // recentlyPublishedData,
InferGetServerSidePropsType<typeof getServerSideProps>) {
   // const { data: googleData } = useGetCategoryQuery({
   //    initialData: recentlyPublishedData,
   //    category: category as Categories,
   //    enabled: !!recentlyPublishedData,
   // });

   // // working with nyt data
   // const enableNytData = category === 'fiction' || category === 'nonfiction';

   // const topList = useGetNytBestSeller({
   //    category: { format: 'combined-print-and-e-book', type: category } as CategoryQualifiers,
   //    date: 'current',
   //    enabled: enableNytData,
   // });

   // const { isHovered, onMouseEnter, onMouseLeave, onMouseLeaveDescription } =
   //    useHoverDisplayDescription();

   // console.log('books data are: ', googleData);
   // console.log(' the current category is : ', category);
   // console.log(' is it enabled : ', enabled);
   // console.log('the current top list data is: ', topList.data);

   return (
      <div>
         <CategoryGridLarge category={`New ${capitalizeWords(category as string)} Releases`}>
            <>
               {/* {googleData.map((book, index) => {
               
            })} */}
            </>
         </CategoryGridLarge>
         <CategoryGridSmall category={`${capitalizeWords(category as string)} Best Sellers`}>
            <>
               <div>Hello</div>
               <div>Hello</div>
               <div>Hello</div>
            </>
         </CategoryGridSmall>
         <div>
            {/* component here */}
            <article>
               <h3>New Released {capitalizeWords(category as string)} Books</h3>
               <div></div>
            </article>

            <div></div>
         </div>
      </div>
   );
}

// retrieve categories in their library and see whether the library
// can it retrieve new released?
// is inside the cateogry that is being clicked
//

export const getServerSideProps: GetServerSideProps<{
   category: Categories | CategoryQualifiers['type'];
   userId: string | null;
   // recentlyPublishedData: Pages<Record<string, string>>;
}> = async (context: any) => {
   const category = context.query.slug;

   const session = await getSession(context);
   const user = session?.user as CustomSession;
   const userId = user?.id || null;

   // const url = googleApi.getUrlBySubject(category, {
   //    maxResultNumber: 15,
   //    pageIndex: 0,
   //    byNewest: true,
   // });

   // const data = await fetcher(url);

   return {
      props: {
         category: category,
         userId: userId,
         // recentlyPublishedData: data || null,
      },
   };
};
