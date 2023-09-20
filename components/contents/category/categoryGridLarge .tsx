import { CategoryDisplayProps, CategoryHeader } from '../home/categories';

export const CategoryGridLarge = ({ category, children, forwardRef }: CategoryDisplayProps) => {
   return (
      <article id={category as string}>
         <CategoryHeader category={category} />
         <div className='px-1 py-1 lg:px-2 lg:py-2'>
            <div
               ref={forwardRef}
               className='relative scollbars justify-start lg:overflow-hidden grid grid-cols-5 grid-rows-3'
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
      <article id={category as string}>
         <CategoryHeader category={category} />
         <div className='px-1 py-1 lg:px-2 lg:py-2 lg:max-w-3xl'>
            <div ref={forwardRef} className='grid grid-cols-3 lg:gap-x-4'>
               {children}
            </div>
         </div>
      </article>
   );
};
