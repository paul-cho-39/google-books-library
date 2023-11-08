import { useCallback, useEffect, useRef } from 'react';
import useHoverDisplayDescription from './useHoverDisplay';
import { useDisableBreakPoints } from './useDisableBreakPoints';
import layoutManager from '@/constants/layouts';
import { changeDirection } from '../helper/getContainerPos';

// is there a way to create a sliding component instead(?)
function useFloatingPosition(totalCols: number, multiCols: boolean) {
   const floatingRef = useRef<HTMLDivElement>(null);
   const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});

   const { isHovered, onMouseEnter, onMouseLeave, onMouseLeaveDescription } =
      useHoverDisplayDescription();

   const setImageRef = useCallback((id: string, el: HTMLDivElement | null) => {
      if (imageRefs.current) imageRefs.current[id] = el;
   }, []);

   const largeEnabled = useDisableBreakPoints();
   const smallEnabled = useDisableBreakPoints(layoutManager.constants.smallScreen);

   const smallScreenCols = Math.min(3, totalCols / 2);
   const NUMBER_OF_COLS = largeEnabled
      ? totalCols
      : smallEnabled
      ? smallScreenCols + 1
      : smallScreenCols;

   useEffect(() => {
      if (
         isHovered.id &&
         isHovered.index &&
         isHovered.hovered &&
         floatingRef.current &&
         imageRefs.current
      ) {
         // should get reversal by screen size?
         const el = imageRefs.current[isHovered.id]?.getBoundingClientRect();
         const largeReverseGrid = largeEnabled ? NUMBER_OF_COLS - 2 : NUMBER_OF_COLS - 1;

         if (el) {
            let top: number;
            // multiple columns require it to reposition the top position
            if (multiCols) {
               const currentIdx = isHovered.index - 1;
               const row = Math.floor(currentIdx / 5);
               const height = (el.top + window.scrollY) / (row + 1);
               top = height * row;
            } else {
               top = 0;
            }

            const position = changeDirection(
               el.width,
               isHovered.index,
               NUMBER_OF_COLS,
               largeReverseGrid,
               layoutManager.home.padding,
               layoutManager.home.offset
            );

            floatingRef.current.style.top = `${top}px`;
            floatingRef.current.style.position = 'absolute';

            if (position.right > 0) {
               floatingRef.current.style.right = `${position.right}px`;
            } else {
               floatingRef.current.style.left = `${position.left}px`;
            }
         }
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [NUMBER_OF_COLS, isHovered, largeEnabled]);

   return {
      isHovered,
      setImageRef,
      floatingRef,
      onMouseEnter,
      onMouseLeave,
      onMouseLeaveDescription,
      largeEnabled,
   };
}

export default useFloatingPosition;
