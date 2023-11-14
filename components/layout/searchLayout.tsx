import classNames from 'classnames';
import React from 'react';

const SearchLayoutPage = ({
   isSuccess,
   children,
   className,
}: {
   isSuccess: boolean;
   children?: React.ReactNode;
   className?: string;
}) => {
   return (
      <div
         role={isSuccess ? 'listitem' : 'alert'}
         className={classNames(
            isSuccess ? 'h-[100%]' : 'h-[100vh] px-4 lg:px-16 lg:py-2  overflow-hidden',
            'dark:bg-slate-800 mx-auto px-4 lg:px-16 lg:py-2',
            className
         )}
      >
         {children}
      </div>
   );
};

export default SearchLayoutPage;
