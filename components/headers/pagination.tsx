import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';

interface PaginationProps {
   currentPage: number;
   totalItems: number;
   itemsPerPage: number;
   onPageChange: (currentPage: number) => void;
}

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) => {
   const totalPages = Math.ceil(totalItems / itemsPerPage);

   let startPage = 0;
   let endPage = totalPages;
   const maxVisiblePages = 10;

   if (totalPages > maxVisiblePages) {
      // Calculate the start and end pages for pagination
      startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
      endPage = startPage + maxVisiblePages - 1;

      if (endPage > totalPages) {
         endPage = totalPages;
         startPage = endPage - maxVisiblePages + 1;
      }
   }

   const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

   return (
      <nav
         aria-label='pagination'
         className='w-full flex flex-row border-1 border-beige dark:border-charcoal px-0 lg:px-4'
      >
         <div className='-mt-px flex flex-1 justify-end gap-x-2 '>
            <button
               className={classNames(
                  currentPage === 1 ? 'hidden' : 'cursor-pointer',
                  'flex flex-row items-center mx-2 text-sm text-slate-900 dark:text-slate-100 font-medium'
               )}
               disabled={currentPage === 1}
               onClick={() => onPageChange(currentPage - 1)}
            >
               <ArrowLongLeftIcon
                  className='h-4 w-4 text-slate-900 dark:text-slate-100'
                  aria-hidden='true'
               />
               <span className='mx-2'>Previous</span>
            </button>

            {startPage > 1 && (
               <>
                  <button onClick={() => onPageChange(1)}>1</button>
                  <span>...</span>
               </>
            )}

            {pageNumbers.map((number) => (
               <button
                  className={classNames(
                     number === currentPage ? 'font-medium' : 'font-light',
                     'text-lg dark:text-slate-100'
                  )}
                  key={number}
                  disabled={number === currentPage}
                  onClick={() => onPageChange(number)}
               >
                  {number}
               </button>
            ))}

            {endPage < totalPages && (
               <>
                  <span className='text-slate-800 dark:text-slate-100'>...</span>
                  <button onClick={() => onPageChange(totalPages)}>{totalPages}</button>
               </>
            )}

            <button
               className={classNames(
                  currentPage === totalPages ? 'hidden' : 'cursor-pointer',
                  'flex flex-row items-center mx-2 text-sm text-slate-900 dark:text-slate-100 font-medium'
               )}
               disabled={currentPage === totalPages}
               onClick={() => onPageChange(currentPage + 1)}
            >
               <span className='mx-2'>Next</span>
               <ArrowLongRightIcon
                  className='mr-3 h-4 w-4 text-slate-900 dark:text-slate-100'
                  aria-hidden='true'
               />
            </button>
         </div>
      </nav>
   );
};

export default Pagination;
