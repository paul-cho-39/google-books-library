import { MagnifyingGlassCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { useState } from 'react';

interface SearchInputInterface {
   filterQuery?: string;
}

const SearchInput = ({ filterQuery }: SearchInputInterface) => {
   function capitalizeFirstLetter(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
   }

   const [isFocus, setIsFocus] = useState(false);

   return (
      <form className='w-full' action='#' method='GET'>
         <label htmlFor='search' className='sr-only'>
            Search Books
         </label>
         <div className='relative mt-2 flex w-full'>
            <input
               type='text'
               name='search'
               id='search'
               placeholder='Search books'
               onFocus={() => setIsFocus(true)}
               className='flex-grow rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-[0.5px] ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-orange-300 sm:text-sm sm:leading-6'
            />
            <MagnifyingGlassIcon
               className='cursor-pointer relative top-2 right-8 h-5 w-5 text-slate-600 dark:text-slate-200'
               aria-hidden='true'
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
      </form>
   );
};

export default SearchInput;
