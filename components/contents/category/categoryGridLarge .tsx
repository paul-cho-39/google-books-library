import { CategoryDisplayProps, CategoryHeader } from '../home/categories';

export const CategoryGridLarge = ({ category, children, forwardRef }: CategoryDisplayProps) => {
   return (
      <article id={category as string}>
         <CategoryHeader category={category} />
         <div className='px-1 py-1 rounded-md lg:px-2 lg:py-2'>
            <div
               ref={forwardRef}
               className='relative scollbars flex justify-start space-x-4 lg:overflow-hidden lg:grid lg:grid-cols-5 lg:grid-rows-3'
            >
               {children}
            </div>
         </div>
      </article>
   );
};

export const CategoryGridSmall = ({ category, children, forwardRef }: CategoryDisplayProps) => {
   return (
      <article id={category as string}>
         <CategoryHeader category={category} />
         <div className='px-1 py-1 rounded-md lg:px-2 lg:py-2'>
            <div
               ref={forwardRef}
               className='relative scollbars flex justify-start space-x-4 lg:overflow-hidden lg:grid lg:grid-cols-5 lg:grid-rows-3'
            >
               {children}
            </div>
         </div>
      </article>
   );
};
