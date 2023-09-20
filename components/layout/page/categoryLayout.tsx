import classNames from 'classnames';
import { ReactNode } from 'react';
import { CategoryHeaderParams } from '../../../constants/categories';

export interface CategoryLayoutProps {
   category: CategoryHeaderParams;
   children: React.ReactNode;
   className?: string;
   forwardRef?: React.RefObject<HTMLDivElement>;
}

const CategoryLayout = ({ category, children, className, forwardRef }: CategoryLayoutProps) => {
   return (
      <article
         id={category as string}
         className='xl:ml-14 scollbars overflow-y-hidden lg:overflow-hidden'
      >
         <div
            className={classNames(
               className,
               'scollbars lg:overflow-x--hidden px-1 py-1 md:max-w-2xl lg:px-2 lg:py-2 lg:max-w-4xl'
            )}
         >
            {children}
         </div>
      </article>
   );
};

export default CategoryLayout;
