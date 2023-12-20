import { useCallback, useState } from 'react';

type ImageLoadParams = Record<string, boolean>;

/**
 * Checks whether images are loaded. Ensures all images are loaded and the images loaded to be more than
 * 'totalImagesToLoad'
 * @param {number} totalImagesToLoad
 * @returns
 */
export default function useImageLoadTracker(totalImagesToLoad: number) {
   const [loadedImages, setLoadedImages] = useState<ImageLoadParams>({});

   const handleImageLoad = useCallback((bookId: string, qualifiers: string | number) => {
      const pseudoId = bookId + qualifiers;
      setLoadedImages((prevState) => ({
         ...prevState,
         [pseudoId]: true,
      }));
   }, []);

   // if images equal to or more than the number of images to be loaded
   // then all images have completed loading and return 'true'
   const areAllImagesLoaded = useCallback(() => {
      const loadedCount = Object.values(loadedImages).filter((isLoaded) => isLoaded).length;
      return loadedCount >= totalImagesToLoad;
   }, [loadedImages, totalImagesToLoad]);

   return { handleImageLoad, areAllImagesLoaded, loadedImages };
}
