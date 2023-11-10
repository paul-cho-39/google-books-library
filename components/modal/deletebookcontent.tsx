// DeleteButton should be the children

import classNames from 'classnames';

type DeleteBookContentProps = {
   isHidden: boolean;
   toggleHide: () => void;
   buttonClassName?: string;
   children?: React.ReactNode;
};

type ModalDeleteBookContentProps = Omit<DeleteBookContentProps, 'toggleHide'>;

export const DeleteBookContent = ({
   isHidden,
   toggleHide,
   buttonClassName,
   children,
}: DeleteBookContentProps) => {
   return (
      <>
         {isHidden && (
            <div>
               <p role='alert' className='mb-5 px-6'>
                  All data will be lost containing this book. Are you sure you want to delete the
                  data?
               </p>
               <div className='flex flex-row justify-evenly items-center'>
                  <button
                     className={classNames('btn-secondary text-center mb-2', buttonClassName)}
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

export const ModalDeleteBookContent = ({ isHidden, children }: ModalDeleteBookContentProps) => {
   return (
      <>
         {isHidden && (
            <div>
               <p role='alert' className='mb-5 px-6'>
                  All data will be lost containing this book. Are you sure you want to delete the
                  data?
               </p>
               <div className='flex flex-row justify-evenly items-center'>{children}</div>
            </div>
         )}
      </>
   );
};
