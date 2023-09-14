import { useMemo } from 'react';
import { isBookInData } from '../../lib/helper/books/isBooksInLibrary';
import { CheckIcon } from '@heroicons/react/20/solid';
import React from 'react';

interface FilterStatusProps {
   bookId: string;
   finishedData?: string[];
   currentlyReading?: string[];
   wantToRead?: string[];
}

const FilterStatus = ({
   bookId,
   finishedData,
   currentlyReading,
   wantToRead,
}: FilterStatusProps) => {
   const readingStatusMap = {
      finished: {
         data: finishedData,
         text: 'Finished reading',
         iconProps: { fill: 'green', stroke: 'green' },
      },
      current: {
         data: currentlyReading,
         text: 'Currently reading',
         iconProps: { fill: 'green', stroke: 'green' },
      },
      wantToRead: {
         data: wantToRead,
         text: 'Want to read',
         iconProps: { fill: 'white', stroke: 'white' },
      },
   };

   const readingStatus = useMemo(() => {
      for (const statusKey in readingStatusMap) {
         const status = readingStatusMap[statusKey as keyof typeof readingStatusMap];
         if (isBookInData(bookId, status.data)) {
            return status;
         }
      }
      return null;
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [bookId, finishedData, currentlyReading, wantToRead]);

   if (!readingStatus) return null;

   return (
      <div className='inline-flex flex-row'>
         <CheckIcon height='20' width='20' {...readingStatus.iconProps} />
         <span>{readingStatus.text}</span>
      </div>
   );
};

export default FilterStatus;
