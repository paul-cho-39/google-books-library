import { useEffect, useState } from 'react';
import styles from './../styles/Home.module.css';
import classNames from 'classnames';

interface RootElements {
   bookWidth?: string | number;
   bookHeight?: string | number;
}

interface SpinnerProps extends RootElements {
   top?: string;
   left?: string;
   right?: string;
}

const BookLoader = ({
   bookHeight,
   bookWidth,
   top = 'top-[200px]',
   left = 'left-[40vw]',
   right,
}: SpinnerProps) => {
   // const el = document.querySelector(":root");
   function setRootElement(rootElement: string, value?: typeof bookWidth | typeof bookHeight) {
      value && document.documentElement.style.setProperty(rootElement, value.toString());
   }

   useEffect(() => {
      setRootElement('--bookHeight', bookHeight);
      setRootElement('--bookWidth', bookWidth);
   }, []);

   // can build this even more neat if position threshold passes
   // then write more '---'
   return (
      <>
         {/* <div className="relative top-[200px] left-[40vw] mx-auto"> */}
         <div className={`relative ${top} ${left} mx-auto`}>
            <div className={styles.book}>
               <figure className={styles.page}>
                  <span className="text-xl whitespace-pre-line break-all animate-dot after:content-[''] ">
                     ---
                  </span>
               </figure>
               <figure className={styles.page}>
                  <span className='text-xlg'>-</span>
               </figure>
               <figure className={styles.page}>
                  <span className='text-xlg'>--</span>
               </figure>
            </div>
         </div>
      </>
   );
};

export const Sample = () => {
   const height = 150;
   const width = height * (3 / 4.25);
   return (
      // <div
      //    className={styles.scollbars}
      //    //  className={`${styles.scrollbars} text-center`}
      //    //  className='bg-slate-100 flex overflow-x-auto space-x-14 border-gray-300 p-4'
      // >
      <div className='scollbars flex items-start justify-evenly space-x-8'>
         <div style={{ height, width }} className='bg-red-200 px-1 '>
            Item 1
         </div>
         <div style={{ height, width }} className='bg-red-200  px-1'>
            Item 2
         </div>
         <div style={{ height, width }} className='bg-red-200 px-1'>
            Item 3
         </div>
         <div style={{ height, width }} className='bg-blue-400  px-1'>
            Item 4
         </div>
         <div style={{ height, width }} className='bg-blue-400  px-1'>
            Item 5
         </div>
         <div style={{ height, width }} className='bg-blue-400  px-1'>
            Item 6
         </div>
      </div>
   );
};

export default BookLoader;
