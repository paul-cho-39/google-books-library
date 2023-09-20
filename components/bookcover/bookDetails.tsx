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
      return !detail ? 'hidden' : 'my-2';
   };

   const hoverStyle =
      'cursor-pointer hover:opacity-80 hover:underline hover:underline-offset-1 hover:decoration-orange-600 dark:hover:decoration-orange-300 transition-all duration-75';

   return (
      <div>
         <table
            aria-expanded={isExpanded}
            className={classNames(isExpanded ? 'table-fixed w-full my-4' : 'hidden', className)}
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
                  <td className='inline-flex justify-start items-start'>Categories</td>
                  <td>
                     <Categories
                        hasLink={true}
                        className={classNames(hoverStyle)}
                        categories={categories}
                     />
                  </td>
               </tr>
               <tr className={hideElement(publisher)}>
                  <td>Publisher</td>
                  <td>{publisher}</td>
               </tr>
               <tr className={hideElement(infoLinks)}>
                  <td scope='row'>Additional Info</td>
                  <td
                     role='link'
                     aria-label='More information of the book'
                     className='overflow-hidden text-ellipsis line-clamp-1'
                  >
                     <a className={classNames(hoverStyle)} href={infoLinks as string}>
                        {infoLinks}
                     </a>
                  </td>
               </tr>
            </tbody>
         </table>
         <button
            onClick={expandDetails}
            className={classNames(hoverStyle, 'inline-flex items-center justify-center ')}
            aria-label={!isExpanded ? 'expand for book details' : 'collapse book details'}
         >
            <span className='text-md font-medium mr-1 dark:text-slate-200'>Book details</span>
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
