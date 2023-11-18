import { useEffect, useState } from 'react';

const LARGE_BREAK_POINT = 1023;

export const useDisableBreakPoints = (size: number = LARGE_BREAK_POINT) => {
   const [isDisabled, setIsDisabled] = useState(false);

   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth > size) {
            // You can set this to whatever breakpoint you want
            setIsDisabled(true);
         } else {
            setIsDisabled(false);
         }
      };
      handleResize();

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
   }, [size]);

   return isDisabled;
};
