import classNames from 'classnames';
import React from 'react';

const SearchLayoutPage = ({
   isSuccess,
   children,
}: {
   isSuccess: boolean;
   children?: React.ReactNode;
}) => {
   return (
      <div
         className={classNames(
            isSuccess ? '' : 'h-[100vh] px-4 lg:px-16 lg:py-2  overflow-hidden',
            'dark:bg-slate-800 mx-auto px-4 lg:px-16 lg:py-2'
         )}
      >
         {children}
      </div>
   );
};

export default SearchLayoutPage;
