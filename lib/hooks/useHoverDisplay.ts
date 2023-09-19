import { useEffect, useState } from 'react';

type HoveredProps = {
   id: string | null;
   hovered: boolean;
   isFloatHovered: boolean;
   index: number | null;
};

function useHoverDisplayDescription() {
   const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout>(null!);
   const [isHovered, setIsHovered] = useState<HoveredProps>({
      id: null,
      hovered: false,
      isFloatHovered: false,
      index: null,
   });

   const onMouseEnter = (id: string, index: number) => {
      if (!id) return;

      clearTimeout(hoverTimer);
      setHoverTimer(
         setTimeout(() => {
            setIsHovered({ id, hovered: true, isFloatHovered: false, index: index + 1 });
         }, 350)
      );
   };

   const onMouseLeave = (e: React.MouseEvent, floatingRef: React.RefObject<HTMLDivElement>) => {
      const floatingElement = floatingRef.current;

      if (
         floatingElement &&
         e.relatedTarget instanceof Node &&
         floatingElement.contains(e.relatedTarget)
      ) {
         return;
      }

      clearTimeout(hoverTimer);
      if (isHovered.id !== null) {
         setIsHovered({ id: null, hovered: false, isFloatHovered: false, index: null });
      }
   };

   const onMouseLeaveDescription = () => {
      clearTimeout(hoverTimer);
      if (isHovered.id !== null) {
         setIsHovered({ id: null, hovered: false, isFloatHovered: false, index: null });
      }
   };

   return { isHovered, onMouseEnter, onMouseLeave, onMouseLeaveDescription };
}

export default useHoverDisplayDescription;
