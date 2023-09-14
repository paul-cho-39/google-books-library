import { TotalResults } from './cards';

const EmptyResult = ({ query, isError }: { query: string; isError: boolean }) => {
   const message = isError ? 'Error occurred while fetching data' : `No book result for ${query}`;
   return (
      <div className='mx-auto h-[100vh] px-4 lg:px-16 lg:py-2 dark:slate-800 overflow-hidden'>
         <TotalResults result={0} />
         <div className='relative flex justify-center mb-6'>
            <div className='absolute border-t-[1.5px] border-gray-200 w-full' />
         </div>
         <div>
            <p className='dark:text-slate-100 text-xl italic'>{message}</p>
         </div>
      </div>
   );
};

export default EmptyResult;
