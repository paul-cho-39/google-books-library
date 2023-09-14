import { Items } from '../../lib/types/googleBookTypes';

const BookSearchSkeleton: React.FunctionComponent<{
   books: string[] | Record<string, unknown>[] | number;
}> = ({ books }) => {
   const getTotalItemsRendered = () => {
      if (typeof books === 'number') {
         return Array(books).fill(0);
      }
      return books;
   };

   const totalItemsRendered = getTotalItemsRendered();

   return (
      <div role='listbox' aria-label='skeleton loader' className='mx-auto w-full lg:max-w-2xl'>
         {totalItemsRendered.map((book, index) => (
            <div
               key={book.index}
               role='status'
               className='mt-14 space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center'
            >
               <div className='flex items-start px-2 py-4'>
                  <div className='w-48 pr-8 h-48 bg-gray-300 rounded dark:bg-gray-700 md:col-span-1 lg:w-56'></div>
                  <div className='w-full ml-6 lg:ml-1'>
                     <div className='h-10 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4'></div>
                     <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5'></div>
                     <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5'></div>
                     <div className='h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]'></div>
                  </div>
                  <span className='sr-only'>Loading...</span>
               </div>
            </div>
         ))}
      </div>
   );
};

export const ButtonSkeleton = () => {
   return <div className='h-10 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4'></div>;
};

export default BookSearchSkeleton;
