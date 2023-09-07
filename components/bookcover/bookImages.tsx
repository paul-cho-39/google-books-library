import Image, { ImageProps } from 'next/image';
import { ImageLinks, ImageLinksPairs } from '../../lib/types/googleBookTypes';
import { getAvailableThumbnail } from '../../lib/helper/books/editBookPageHelper';
import clsx from 'clsx';
import classNames from 'classnames';
import { ForwardRefRenderFunction } from 'react';

type OmittedImageProps = Omit<ImageProps, 'src' | 'width' | 'height'>;

interface BookImageProps<T extends ImageLinksPairs | ImageLinks> extends OmittedImageProps {
   bookImage: T | undefined;
   title: string;
   width: number;
   height: number;
   forwardedRef?: (el: HTMLDivElement) => void;
   // forwardedRef?: Record<string, HTMLDivElement | null>;
   onMouseEnter?: () => void;
   onMouseLeave?: (e: React.MouseEvent) => void;
   className?: string;
}

const BookImage = <T extends ImageLinksPairs | ImageLinks>({
   bookImage,
   title,
   width = 135,
   height = 185,
   forwardedRef,
   onMouseEnter,
   onMouseLeave,
   className,
   ...restProps
}: BookImageProps<T>) => {
   const thumbnail = getAvailableThumbnail(bookImage);
   const defaultStyle =
      'w-full inline-flex items-center justify-center divide-y-2 divide-gray-400 mb-8';

   return (
      <div
         ref={forwardedRef}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
         className={className ? clsx(defaultStyle, className) : defaultStyle}
      >
         <Image
            src={thumbnail}
            alt={`Picture of ${title} cover`}
            priority
            width={width}
            height={height}
            {...restProps}
         />
      </div>
   );
};

export default BookImage;
