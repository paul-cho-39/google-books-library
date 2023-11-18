import NextHead from '@/components/headers/header';
import metaHeaders from '@/constants/headers';

const CategoryPageLayout = ({ 
   category,
   children 
}: { 
   category: string;
   children: React.ReactNode }) => {
   return (
      <div className='w-full min-h-screen dark:bg-slate-800'>
         <NextHead title={metaHeaders.categories.title(category)} metaTags={metaHeaders.categories.meta()} />
         {children}
      </div>
   );
};

export default CategoryPageLayout;
