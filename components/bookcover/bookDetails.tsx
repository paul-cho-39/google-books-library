import { ChevronDownIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { useState } from 'react';
import Categories from './categories';

interface BookDetails {
   page?: number;
   categories?: string[];
   language?: string;
   publisher?: string;
   infoLinks?: string;
   className?: string;
}

const BookDetails = ({
   page,
   categories,
   publisher,
   infoLinks,
   language,
   className,
}: BookDetails) => {
   const [isExpanded, setExpanded] = useState(false);
   const expandDetails = () => {
      setExpanded(!isExpanded);
   };

   const hideElement = (detail?: any) => {
      return !detail ? 'hidden' : '';
   };

   return (
      <div>
         <table
            aria-expanded={isExpanded}
            className={classNames(isExpanded ? 'table-fixed w-full' : 'hidden', className)}
         >
            <tbody className='font-light text-slate-600 dark:text-slate-300'>
               <tr className={hideElement(page)}>
                  <td>Page</td>
                  <td>{page}</td>
               </tr>
               <tr className={hideElement(language)}>
                  <td>Language</td>
                  <td className='uppercase'>{language}</td>
               </tr>
               <tr className={hideElement(categories)}>
                  <td>Categories</td>
                  <td>
                     <Categories categories={categories} />
                  </td>
               </tr>
               <tr className={hideElement(publisher)}>
                  <td>Publisher</td>
                  <td>{publisher}</td>
               </tr>
               <tr className={hideElement(infoLinks)}>
                  <td>Additional Info</td>
                  <td className='overflow-hidden text-ellipsis line-clamp-1'>{infoLinks}</td>
               </tr>
            </tbody>
         </table>
         <button
            onClick={expandDetails}
            className='inline-flex items-center justify-center'
            aria-label={!isExpanded ? 'expand for book details' : 'collapse book details'}
         >
            <span className='text-md font-medium dark:text-slate-200'>Book details</span>
            <ChevronDownIcon
               className={classNames(
                  isExpanded ? 'rotate-180' : 'rotate-0',
                  'h-5 w-5 dark:text-slate-200 transition-all duration-75'
               )}
            />
         </button>
      </div>
   );
};

export default BookDetails;
