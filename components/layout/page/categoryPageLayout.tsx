import APIErrorBoundary from '@/components/error/errorBoundary';
import NextHead from '@/components/headers/header';
import Spinner from '@/components/loaders/spinner';
import metaHeaders from '@/constants/headers';
import { LayoutBase } from '@/lib/types/theme';

interface CategoryPageLayoutProps extends LayoutBase {
   category: string;
}

const CategoryPageLayout = ({ category, isLoading, children }: CategoryPageLayoutProps) => {
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
      <div className='w-full min-h-screen dark:bg-slate-800'>
         <NextHead
            title={metaHeaders.categories.title(category)}
            metaTags={metaHeaders.categories.meta()}
         />
         <APIErrorBoundary>
            <main>{children}</main>
         </APIErrorBoundary>
      </div>
   );
};

export default CategoryPageLayout;
