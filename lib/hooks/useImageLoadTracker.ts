import { useCallback, useState } from 'react';

type ImageLoadParams = Record<string, boolean>;

export default function useImageLoadTracker() {
   const [loadedImages, setLoadedImages] = useState<ImageLoadParams>({});

   const handleImageLoad = useCallback((bookId: string) => {
      setLoadedImages((prevState) => ({
         ...prevState,
         [bookId]: true,
      }));
   }, []);

   // if images equal to or more than the number of images to be loaded
   // then all images have completed loading and return 'true'
   const areAllImagesLoaded = useCallback(
      (totalImagesToLoad: number) => {
         const loadedCount = Object.values(loadedImages).filter((isLoaded) => isLoaded).length;
         return loadedCount >= totalImagesToLoad;
      },
      [loadedImages]
   );

   return { handleImageLoad, areAllImagesLoaded };
}
