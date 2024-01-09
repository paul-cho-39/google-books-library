import React from 'react';
import classNames from 'classnames';
import Spinner from '../loaders/spinner';

// 'isDisplayed' hides the button depending on 'user state' of library
interface UserActionBasicButtonProps {
   name: string;
   isDisplayed?: boolean;
   isDeleteButton?: boolean;
   onClick?: (body?: unknown) => void;
   isLoading?: boolean;
   Icon?: JSX.Element;
   iconDetails?: string;
   className?: string;
}

/**
 * Button component primarily used for providing user action to Add, Update, or Delete the book.
 *
 * @param {Object} UserActionBasicButtonProps
 * @returns JSX.Element
 */
const Button = ({
   isDisplayed,
   onClick,
   name,
   isDeleteButton,
   isLoading,
   Icon,
   iconDetails,
   className,
}: UserActionBasicButtonProps) => {
   return (
      <button
         type='button'
         onClick={onClick}
         disabled={!isDisplayed || isLoading}
         className={classNames(
            isDisplayed ? '' : 'hidden',
            isDeleteButton ? 'btn-alert' : 'btn-primary',
            className,
            'text-base justify-center focus:ring-black hover:ring-black sm:hover:ring-2 focus:ring-2'
         )}
      >
         {isLoading ? <Spinner size='sm' color='indigo' /> : name}
         <span aria-hidden={true}>
            {Icon}
            <span className='sr-only'>{iconDetails}</span>
         </span>
      </button>
   );
};

export default Button;
