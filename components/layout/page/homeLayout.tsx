import APIErrorBoundary from '@/components/error/errorBoundary';
import NextHead from '@/components/headers/header';
import Spinner from '@/components/loaders/spinner';
import metaHeaders from '@/constants/headers';
import { LayoutBase } from '@/lib/types/theme';

const HomeLayout = ({ children, isLoading }: LayoutBase) => {
   return (
      <APIErrorBoundary>
         <div className='w-full h-full py-10 dark:bg-slate-800'>
            <NextHead title={metaHeaders.home.title} metaTags={metaHeaders.home.meta()} />
            {children}
         </div>
      </APIErrorBoundary>
   );
};

export default HomeLayout;
