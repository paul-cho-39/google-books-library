import { Toaster } from 'react-hot-toast';

export type ToasterMessageType = 'added' | 'removed';

const MyToaster = ({ isAdded }: { isAdded?: ToasterMessageType | null }) => {
   return (
      <Toaster
         toastOptions={{
            success: {
               style: {
                  color: 'WindowText',
                  marginTop: '-0.55rem',
                  fontSize: '16px',
                  backgroundColor: 'aliceblue',
                  borderRadius: '0.8rem',
                  height: '3.4rem',
               },
               icon: `${isAdded === 'added' ? '✔️📚' : '✔️🗑'}`,
            },
            duration: 1500,
            ariaProps: {
               role: 'status',
               'aria-live': 'assertive',
            },
         }}
      />
   );
};
export default MyToaster;
