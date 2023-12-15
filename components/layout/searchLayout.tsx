import classNames from 'classnames';
import React from 'react';
import NextHead from '../headers/header';
import metaHeaders from '@/constants/headers';
import APIErrorBoundary from '../error/errorBoundary';

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
      <APIErrorBoundary>
         <div
            role={isSuccess ? 'listitem' : 'alert'}
            className={classNames(
               isSuccess ? 'h-[100%]' : 'h-[100vh] px-4 lg:px-16 lg:py-2 overflow-hidden',
               'dark:bg-slate-800 mx-auto px-4 lg:px-16 lg:py-2',
               className
            )}
         >
            <NextHead title={metaHeaders.search.title} metaTags={metaHeaders.search.meta()} />
            {children}
         </div>
      </APIErrorBoundary>
   );
};

export default SearchLayoutPage;
