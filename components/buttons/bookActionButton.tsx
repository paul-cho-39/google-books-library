import { Suspense, lazy } from 'react';
import SignInRequiredButton from '@/components/Login/requireUser';
import { BookCardProps } from '@/lib/types/components/bookcards';
import ChevronDownIcon from '@heroicons/react/20/solid/ChevronDownIcon';
import { ButtonSkeleton } from '../loaders/bookcardsSkeleton';

type UserActionProps = Pick<BookCardProps, 'book' | 'userId'>;

const SaveAsFinishedButton = lazy(() => import('@/components/buttons/finishedButton'));
const PopOverButtons = lazy(() => import('@/components/buttons/popoverButtons'));

const BookActionButton = ({ book, userId }: UserActionProps) => (
   <div className='flex flex-row items-center justify-center w-full pr-2 lg:pr-5'>
      <SignInRequiredButton
         userId={userId}
         title='Finished'
         className='relative bottom-5 w-[8rem] lg:w-[10rem] inline-flex items-center justify-center rounded-l-2xl border border-gray-400 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 focus:z-10 focus:border-black focus:outline-none focus:ring-1 focus:ring-black'
         signedInActiveButton={
            <Suspense fallback={<ButtonSkeleton />}>
               <SaveAsFinishedButton book={book} userId={userId as string} />
            </Suspense>
         }
      />
      <SignInRequiredButton
         userId={userId}
         className='-top-[1.25rem] relative inline-flex items-center rounded-r-2xl border border-slate-400 bg-white dark:bg-slate-700 px-2 py-2 text-sm font-medium text-gray-500 dark:text-slate-200 hover:bg-gray-50 focus:z-10 focus:border-black focus:outline-none focus:ring-1 focus:ring-black'
         signedInActiveButton={
            <Suspense fallback={<ButtonSkeleton />}>
               <PopOverButtons book={book} userId={userId as string} />
            </Suspense>
         }
      >
         <ChevronDownIcon className='h-5 w-5 text-violet-200 hover:text-violet-100 dark:text-slate-200' />
      </SignInRequiredButton>
   </div>
);

export default BookActionButton;
