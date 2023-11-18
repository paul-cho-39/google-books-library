import NextHead from '@/components/headers/header';
import metaHeaders from '@/constants/headers';

const HomeLayout = ({ 
   children 
}: { 
   children: React.ReactNode }) => {
   return (
      <div className='w-full min-h-screen dark:bg-slate-800'>
         <NextHead title={metaHeaders.home.title} metaTags={metaHeaders.home.meta()} />
         {children}
      </div>
   );
};

export default HomeLayout;
