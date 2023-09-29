import { useEffect, useState } from 'react';
// import styles from './../styles/Home.module.css';
import styles from './../../styles/Home.module.css';

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
   );
};

export default BookLoader;
