import React, { useState } from 'react';
import { FilterProps } from '../../lib/types/googleBookTypes';
import classNames from 'classnames';
import { FunnelIcon } from '@heroicons/react/20/solid';
import { FilterParams } from '../../models/_api/fetchGoogleUrl';

interface FilterComponentProps {
   filter: FilterProps;
   setFilter: React.Dispatch<React.SetStateAction<FilterProps>>;
}

const FilterInput: React.FunctionComponent<FilterComponentProps> = ({ filter, setFilter }) => {
   const [isExpanded, setIsExpanded] = useState(true);

   const toggleExpand = () => {
      setIsExpanded(!isExpanded);
   };

   const handleChange = (
      e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
      field: string
   ) => {
      setFilter({
         ...filter,
         [field]: e.target.value,
      });
   };

   return (
      <div
         aria-label='Filter book search'
         role='region'
         className='text-slate-800 dark:text-white max-w-md mb-2 lg:mb-5 lg:max-w-xl'
      >
         <button
            aria-expanded={isExpanded}
            onClick={toggleExpand}
            className='text-lg font-semibold inline-flex items-center'
         >
            Filter{' '}
            <FunnelIcon
               className={classNames(
                  // isExpanded ? 'rotate-180' : 'rotate-0',
                  'transition-all duration-75 ease-linear h-4 w-4 mx-1 fill-orange-400 dark:fill-slate-200'
               )}
            />
         </button>

         {isExpanded && (
            <div className='mt-4 bg-slate-100 dark:bg-slate-800 rounded p-4'>
               <label className='block mb-2' htmlFor='filterBy'>
                  Filter By:
                  <select
                     aria-label='Filter by category'
                     className='block w-full bg-white dark:bg-gray-800 text-black dark:text-white mt-1 rounded'
                     value={filter.filterBy}
                     onChange={(e) => handleChange(e, 'filterBy')}
                  >
                     <option value='all'>All</option>
                     <option value='title'>Title</option>
                     <option value='author'>Author</option>
                     <option value='isbn'>ISBN</option>
                  </select>
               </label>

               <label className='block mb-2' htmlFor='filterParams'>
                  Filter Params:
                  <select
                     aria-label='Filter by parameter'
                     className='block w-full bg-white dark:bg-gray-800 text-black dark:text-white mt-1 rounded'
                     value={filter.filterBookParams || ''}
                     onChange={(e) => handleChange(e, 'filterParams')}
                  >
                     <option value=''>None</option>
                     <option value='partial'>Partial</option>
                     <option value='full'>Full</option>
                     <option value='free-ebooks'>Free eBooks</option>
                     <option value='paid-ebooks'>Paid eBooks</option>
                     <option value='ebooks'>eBooks</option>
                  </select>
               </label>
            </div>
         )}
      </div>
   );
};

export default FilterInput;
