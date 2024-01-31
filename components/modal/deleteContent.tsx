// DeleteButton should be the children

import classNames from 'classnames';

type DeleteContentProps = {
   isHidden: boolean;
   toggleHide: () => void;
   content: string;
   buttonClassName?: string;
   children?: React.ReactNode;
};

export const DeleteContent = ({
   isHidden,
   toggleHide,
   content,
   buttonClassName,
   children,
}: DeleteContentProps) => {
   return (
      <>
         {isHidden && (
            <div>
               <p role='alert' className='mb-5 px-6'>
                  All data will be lost containing this book. Are you sure you want to delete the
                  data?
                  {content}
               </p>
               <div className='flex flex-row justify-evenly items-center'>
                  <button
                     className={classNames(
                        'btn-secondary inline-flex justify-center items-center mb-2 w-36',
                        buttonClassName
                     )}
                     onClick={toggleHide}
                  >
                     Cancel
                  </button>
                  {children}
               </div>
            </div>
         )}
      </>
   );
};
