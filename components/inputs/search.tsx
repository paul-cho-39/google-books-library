import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import ROUTES from '@/utils/routes';

interface SearchInputInterface {
   // disabled: boolean;
   filterQuery?: string;
}

// be used as context instead since it may be global?
const SearchInput = ({ filterQuery }: SearchInputInterface) => {
   const router = useRouter();

   const [disabled, setDisabled] = useState(true);
   const [query, setQuery] = useState('');

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      if (!query) return;
      e.preventDefault();

      const url = ROUTES.SEARCH(query);
      router.push(url);
   };

   // if router is not ready search wont trigger
   useEffect(() => {
      // ensuring that router is ready
      if (!router.isReady) return;

      setDisabled(false);
   }, [router.isReady]);

   // debugging
   // console.log('is it disabled?: ', disabled);

   return (
      <form role='search' onSubmit={handleSubmit} className='w-full' action='#' method='GET'>
         <label htmlFor='search' className='sr-only'>
            Search Books
         </label>
         <div role='searchbox' className='relative mt-2 flex w-full'>
            <input
               type='text'
               name='search'
               id='search'
               placeholder='Search books'
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               className='flex-grow rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-[0.5px] ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-orange-300 sm:text-sm sm:leading-6'
            />
            <button disabled={disabled} role='button' type='submit'>
               <MagnifyingGlassIcon
                  className='cursor-pointer relative top-0 right-8 h-5 w-5 text-slate-600'
                  title='Search'
                  aria-hidden='true'
               />
            </button>
         </div>
      </form>
   );
};

export default SearchInput;
