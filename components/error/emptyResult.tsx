import { TotalResults } from '../bookcards/cards';
import SearchLayoutPage from '../layout/searchLayout';

const EmptyResult = ({
   query,
   isError,
   children,
}: {
   query: string;
   isError: boolean;
   children?: React.ReactNode;
}) => {
   const message = isError ? 'Error occurred while fetching data' : `No book result for ${query}`;
   return (
      <SearchLayoutPage isSuccess={false}>
         {children}
         <TotalResults result={0} />
         <div className='relative flex justify-center mb-6'>
            <div className='absolute border-t-[1.5px] border-gray-200 w-full' />
         </div>
         <div>
            <p className='dark:text-slate-100 text-xl italic'>{message}</p>
         </div>
      </SearchLayoutPage>
   );
};

export default EmptyResult;
