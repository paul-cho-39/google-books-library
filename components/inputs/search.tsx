import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

interface SearchInputInterface {
   filterQuery?: string;
}

const SearchInput = ({ filterQuery }: SearchInputInterface) => {
   const [isFocus, setIsFocus] = useState(false);
   const router = useRouter();
   const [query, setQuery] = useState('');

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      if (!query) return;
      e.preventDefault();

      router.push(`/search?q=${query}`);
   };

   return (
      <form onSubmit={handleSubmit} className='w-full' action='#' method='GET'>
         <label htmlFor='search' className='sr-only'>
            Search Books
         </label>
         <div className='relative mt-2 flex w-full'>
            <input
               type='text'
               name='search'
               id='search'
               placeholder='Search books'
               onChange={(e) => setQuery(e.target.value)}
               onFocus={() => setIsFocus(true)}
               className='flex-grow rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-[0.5px] ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-orange-300 sm:text-sm sm:leading-6'
            />
            <button type='submit'>
               <MagnifyingGlassIcon
                  className='cursor-pointer relative top-0 right-8 h-5 w-5 text-slate-600'
                  aria-hidden='true'
               />
            </button>
         </div>
      </form>
   );
};

export default SearchInput;
