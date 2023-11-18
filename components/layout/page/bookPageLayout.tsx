// layout page for /books/[slug]/

import NextHead from '@/components/headers/header';
import metaHeaders from '@/constants/headers';

const PageLayout = ({ 
   title,
   children 
}: { 
   title: string;
   children: React.ReactNode }) => {
   return (
      <div className='mx-auto w-full min-h-screen overflow-y-auto dark:bg-slate-800'>
         <NextHead title={metaHeaders.books.title(title)} metaTags={metaHeaders.books.meta(title)} />
         {children}
      </div>
   );
};

export default PageLayout;
