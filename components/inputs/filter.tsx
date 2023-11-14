import React, { useState } from 'react';
import classNames from 'classnames';
import { FunnelIcon } from '@heroicons/react/20/solid';
import Dropdown from './dropdown';

import { FILTER_BY_OPTIONS, FILTER_PARAMS_OPTIONS } from '@/constants/inputs';
import { FilterContextParams } from '@/lib/types/theme';
import useSearchFilter from '@/lib/hooks/useSearchFilter';

// interface FilterComponentProps {
//    filter: FilterProps;
//    setFilter: React.Dispatch<React.SetStateAction<FilterProps>>;
// }

// const FilterInput: React.FunctionComponent<FilterContextParams> = ({ filter, setFilter }) => {
const FilterInput = () => {
   const { filter, setFilter } = useSearchFilter();
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
         className='text-slate-800 dark:text-white max-w-md mb-2 lg:mb-5 lg:max-w-xl'
      >
         <button
            role='button'
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
            <div role='radiogroup' className='mt-4 bg-slate-100 dark:bg-slate-800 rounded p-4'>
               <Dropdown
                  value={filter.filterBy}
                  options={FILTER_BY_OPTIONS}
                  onChange={(value) => handleChange(value, 'filterBy')}
                  label='Filter category'
               />
               <Dropdown
                  value={filter.filterParams || ''}
                  options={FILTER_PARAMS_OPTIONS}
                  onChange={(value) => handleChange(value, 'filterParams')}
                  label='Filter Availability:'
               />
            </div>
         )}
      </div>
   );
};

export default FilterInput;
