import classNames from 'classnames';
import { Items } from '@/lib/types/googleBookTypes';

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
      <div role='listbox' aria-label='loading data' className='mx-auto w-full lg:max-w-2xl'>
         {totalItemsRendered.map((book, index) => (
            <div
               key={index}
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
   return (
      <div
         aria-label='skeleton loader'
         className='animate-pulse h-10 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4'
      ></div>
   );
};

export const DescriptionSkeleton = () => {
   return (
      <div
         aria-label='skeleton loader'
         className='mx-auto w-full animate-pulse flex flex-col gap-y-2'
      >
         <div className='bg-gray-200 h-6 rounded-full dark:bg-gray-700 w-[20%]'></div>
         <div className='bg-gray-200 h-6 rounded-full dark:bg-gray-700 w-[75%]'></div>
         <div className='bg-gray-200 h-6 rounded-full dark:bg-gray-700 w-full'></div>
      </div>
   );
};

export const BookImageSkeleton = ({
   height,
   getWidth,
   className,
}: {
   height: number;
   getWidth: (height: number, ratio?: number) => number;
   className?: string;
}) => {
   const defaultStyle =
      'w-full inline-flex items-center justify-center divide-y-2 mb-8 animate-pulse bg-gray-200 dark:bg-gray-700';
   return (
      <div
         style={{
            height: height,
            width: getWidth(height),
         }}
         aria-label='skeleton loader'
         className={classNames(defaultStyle, className)}
      ></div>
   );
};

export default BookSearchSkeleton;
