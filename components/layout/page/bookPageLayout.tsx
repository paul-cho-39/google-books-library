// layout page for /books/[slug]/

import APIErrorBoundary from '@/components/error/errorBoundary';
import NextHead from '@/components/headers/header';
import Spinner from '@/components/loaders/spinner';
import metaHeaders from '@/constants/headers';
import { LayoutBase } from '@/lib/types/theme';

interface PageLayoutProps extends LayoutBase {
   title: string;
}

const PageLayout = ({ title, isLoading, children }: PageLayoutProps) => {
   if (isLoading) {
      return (
         <div aria-busy={true} className='w-full min-h-screen dark:bg-slate-800'>
            <div className='lg:mt-20 mt-12'>
               <Spinner />
            </div>
         </div>
      );
   }

   return (
      <div className='mx-auto w-full min-h-screen overflow-y-auto px-1 lg:px-6 dark:bg-slate-800'>
         <NextHead
            title={metaHeaders.books.title(title)}
            metaTags={metaHeaders.books.meta(title)}
         />
         <APIErrorBoundary>
            <main>{children}</main>
         </APIErrorBoundary>
      </div>
   );
};

export default PageLayout;
