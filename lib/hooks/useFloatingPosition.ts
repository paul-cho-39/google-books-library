import { useCallback, useEffect, useRef } from 'react';
import useHoverDisplayDescription from './useHoverDisplay';
import { useDisableBreakPoints } from './useDisableBreakPoints';
import layoutManager from '@/constants/layouts';
import { changeDirection } from '../helper/getContainerPos';

interface FloatingPositionParams {
   totalCols: number;
   multiCols: boolean;
   enableOnMedScreen?: boolean;
}

/**
 * A hook for displaying a container when mouse hovers around a target.
 */
function useFloatingPosition({ totalCols, multiCols, enableOnMedScreen }: FloatingPositionParams) {
   const floatingRef = useRef<HTMLDivElement>(null);
   const imageRefs = useRef<Record<string, HTMLDivElement | null>>({});

   // event listener for when mouse enters for setting the id and removing the id
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

   // if not enabled for screens > md, the hovered effect is turned off
   const isEnabled = !enableOnMedScreen ? largeEnabled : true;

   useEffect(() => {
      if (
         isEnabled &&
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

            // TODO: make it customizeable here with offset for offseting the number from the target
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
      isEnabled,
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
