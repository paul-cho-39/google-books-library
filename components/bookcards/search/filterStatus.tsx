import React, { useMemo } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';

import { isBookInData } from '@/lib/helper/books/isBooksInLibrary';
import { Library } from '@/lib/types/models/books';

interface FilterStatusProps {
   bookId: string;
   library: Library | undefined;
}

const FilterStatus = ({ bookId, library }: FilterStatusProps) => {
   const readingStatusMap = {
      finished: {
         data: library?.finished,
         text: 'Finished reading',
         iconProps: { fill: 'green', stroke: 'green' },
      },
      current: {
         data: library?.reading,
         text: 'Currently reading',
         iconProps: { fill: 'green', stroke: 'green' },
      },
      wantToRead: {
         data: library?.want,
         text: 'Want to read',
         iconProps: { fill: 'white', stroke: 'white' },
      },
   };

   // returns book status if users reading the book in the library
   const readingStatus = useMemo(() => {
      for (const statusKey in readingStatusMap) {
         const status = readingStatusMap[statusKey as keyof typeof readingStatusMap];
         if (isBookInData(bookId, status.data)) {
            return status;
         }
      }
      return null;

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [bookId, library]);

   // early exit when there is no user or the library is empty
   if (!readingStatus) return null;

   return (
      <div role='status' className='inline-flex flex-row -my-2'>
         <CheckIcon aria-disabled={true} height='16' width='16' {...readingStatus.iconProps} />
         <h4 className='text-slate-600 px-2 dark:text-slate-400 font-semibold text-sm'>
            {readingStatus.text}
         </h4>
      </div>
   );
};

export default FilterStatus;
