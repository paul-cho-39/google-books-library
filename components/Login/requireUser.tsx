import { useRouter } from 'next/router';
import { ButtonProps } from '../bookcards/currentReadingButton';
import classNames from 'classnames';
import { ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

interface SignInRequiredButtonProps {
   type: 'finished' | 'popover';
   signedInActiveButton: JSX.Element;
   userId?: string | null;
}

// TODO: this is a wrapper component but the button styling has to be the same
// so have the styling same as the buttons
const SignInRequiredButton = ({
   type,
   userId,
   signedInActiveButton,
}: SignInRequiredButtonProps) => {
   const router = useRouter();

   const handlePress = () => {
      router.push('/auth/signup');
   };

   const style =
      type === 'finished'
         ? 'relative bottom-5 w-[8rem] lg:w-[10rem] inline-flex items-center justify-center rounded-l-2xl border border-gray-400 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 focus:z-10 focus:border-black focus:outline-none focus:ring-1 focus:ring-black'
         : '-top-[1.25rem] relative inline-flex items-center rounded-r-2xl border border-slate-400 bg-white dark:bg-slate-700 px-2 py-2 text-sm font-medium text-gray-500 dark:text-slate-200 hover:bg-gray-50 focus:z-10 focus:border-black focus:outline-none focus:ring-1 focus:ring-black';

   return userId ? (
      signedInActiveButton
   ) : (
      <button onClick={handlePress} className={classNames(style)}>
         {type === 'finished' ? (
            'Finished'
         ) : (
            <ChevronDownIcon className='h-5 w-5 text-violet-200 hover:text-violet-100 dark:text-slate-200' />
         )}
      </button>
   );
};

export default SignInRequiredButton;
