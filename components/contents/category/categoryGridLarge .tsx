import { CategoryDisplayProps, CategoryHeader } from '../home/categories';

export const CategoryGridLarge = ({ category, children, forwardRef }: CategoryDisplayProps) => {
   return (
      <article id={category as string}>
         <CategoryHeader category={category} />
         <div className='px-2 py-2 my-4 lg:px-2 lg:py-2 w-full'>
            <div
               ref={forwardRef}
               className='relative scollbars lg:overflow-hidden grid grid-cols-3 lg:grid-cols-5 grid-rows-3'
            >
               {children}
            </div>
         </div>
      </article>
   );
};

interface CategoryGridSmallParams extends CategoryDisplayProps {}

export const CategoryGridSmall = ({ category, children, forwardRef }: CategoryDisplayProps) => {
   return (
      <article className='my-4 lg:my-8' id={category as string}>
         <CategoryHeader category={category} />
         <div className='px-2 py-2 my-4 lg:px-2 lg:py-2 w-full'>
            <div ref={forwardRef} className='grid grid-cols-2 lg:grid-cols-3'>
               {children}
            </div>
         </div>
      </article>
   );
};
