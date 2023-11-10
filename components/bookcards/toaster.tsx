import { Toaster } from 'react-hot-toast';

const MyToaster = ({ isAdded }: { isAdded: boolean }) => {
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
               icon: `${isAdded ? '✔️📚' : '✔️🗑'}`,
            },
            duration: 750,
            ariaProps: {
               role: 'status',
               'aria-live': 'assertive',
            },
         }}
      />
   );
};
export default MyToaster;
