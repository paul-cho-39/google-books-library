import { lazy } from 'react';
import SignInRequiredButton from '@/components/Login/requireUser';
import { BookCardProps } from '@/lib/types/components/bookcards';

type UserActionProps = Pick<BookCardProps, 'book' | 'userId'>;

const SaveAsFinishedButton = lazy(() => import('@/components/buttons/finishedButton'));
const PopOverButtons = lazy(() => import('@/components/buttons/popoverButtons'));

const UserActions = ({ book, userId }: UserActionProps) => (
   <div className='flex flex-row items-end w-full pr-5'>
      <SignInRequiredButton
         type='finished'
         userId={userId}
         signedInActiveButton={<SaveAsFinishedButton book={book} userId={userId as string} />}
      />
      <SignInRequiredButton
         type='popover'
         userId={userId}
         signedInActiveButton={<PopOverButtons book={book} userId={userId as string} />}
      />
   </div>
);

export default UserActions;
