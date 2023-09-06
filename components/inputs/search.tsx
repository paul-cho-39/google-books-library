import { MagnifyingGlassCircleIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { useState } from 'react';

interface SearchInputInterface {
   filterQuery: string;
}

const SearchInput = ({ filterQuery }: SearchInputInterface) => {
   function capitalizeFirstLetter(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
   }

   const [isFocus, setIsFocus] = useState(false);

   return (
      <>
         <label htmlFor='search' className='block text-sm font-medium leading-6 text-gray-900'>
            Search by {capitalizeFirstLetter(filterQuery)}
         </label>
         <div className='relative mt-2 flex items-center'>
            <input
               type='text'
               name='search'
               id='search'
               onFocus={() => setIsFocus(true)}
               className='block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-[0.5px] ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-orange-300 sm:text-sm sm:leading-6'
            />
            <div
               className={classNames(
                  isFocus ? 'invisible' : 'opacity absolute inset-y-0 right-0 flex py-1.5 pr-1.5',
                  'transition-opacity duration-200'
               )}
            >
               <kbd className='inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400'>
                  ⌘K
               </kbd>
            </div>
         </div>
      </>
   );
};

export default SearchInput;
