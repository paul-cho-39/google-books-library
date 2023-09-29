import { ErrorBoundary } from 'react-error-boundary';
import SearchLayoutPage from '../layout/searchLayout';
import Link from 'next/link';
import ROUTES from '../../utils/routes';

const ErrorFallback = ({ error }: { error: Error }) => {
   return (
      <SearchLayoutPage className='flex flex-col' isSuccess={false}>
         <main>
            <p className='mt-16 text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-200'>
               Something went wrong:
            </p>
            <pre className='mt-6 text-base leading-7 text-slate-800 dark:text-slate-200'>
               {error.message}
            </pre>
            <div className='mt-10'>
               <Link passHref href={ROUTES.HOME}>
                  <a className='text-sm font-semibold leading-7 text-indigo-600 hover:underline hover:decoration-indigo-300'>
                     <span className='text-slate-800 dark:text-slate-200' aria-hidden='true'>
                        &larr;
                     </span>{' '}
                     <span>Back to home</span>
                  </a>
               </Link>
            </div>
         </main>
      </SearchLayoutPage>
   );
};

const APIErrorBoundary = ({ children }: { children: React.ReactNode }) => {
   return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
};

export default APIErrorBoundary;
