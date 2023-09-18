import { RefObject, useCallback, useEffect, useState } from 'react';

interface MainProps<K> {
   enabled: boolean;
   target: RefObject<HTMLElement>;
   onIntersect: (value?: K) => void;
}

interface InteractionProp<K> extends MainProps<K> {
   root?: RefObject<Element>;
   rootMargin?: string;
   readonly threshold?: number | number[];
}

export default function useInteractionObserver<K>({
   enabled,
   target,
   onIntersect,
   root,
   rootMargin = '5px',
   threshold = 0.2,
}: InteractionProp<K>): void {
   // maybe set laoder and spinner here?
   const handleObserver = useCallback(
      (entries: any[]) => {
         const [target] = entries;
         setTimeout(() => {
            if (target.isIntersecting) {
               onIntersect();
            }
         }, 250);
      },
      [onIntersect]
   );
   // enabled && onIntersect && pageParam + 20
   useEffect(() => {
      if (!enabled) return;
      // the entry first passes through isIntersecting
      const observer = new IntersectionObserver(handleObserver, {
         root: root && root.current,
         rootMargin: rootMargin,
         threshold: threshold,
      });
      // create an empty div
      const el = target && target.current;
      if (!el) return;
      observer.observe(el);

      return () => {
         observer.unobserve(el);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [enabled, target.current]);
}
