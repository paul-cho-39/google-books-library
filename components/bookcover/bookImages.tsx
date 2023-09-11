import Image, { ImageProps } from 'next/image';
import { ImageLinks, ImageLinksPairs } from '../../lib/types/googleBookTypes';
import { getAvailableThumbnail } from '../../lib/helper/books/editBookPageHelper';
import clsx from 'clsx';
import classNames from 'classnames';
import { ForwardRefRenderFunction, useEffect, useState } from 'react';

type OmittedImageProps = Omit<ImageProps, 'src' | 'width' | 'height' | 'priority'>;
type GoogleImages = ImageLinksPairs | ImageLinks;

interface BookImageProps<T extends GoogleImages | string> extends OmittedImageProps {
   bookImage: T | undefined;
   title: string;
   width: number;
   height: number;
   priority: boolean;
   forwardedRef?: (el: HTMLDivElement) => void;
   // forwardedRef?: Record<string, HTMLDivElement | null>;
   onMouseEnter?: () => void;
   onMouseLeave?: (e: React.MouseEvent) => void;
   className?: string;
}

const BookImage = <T extends GoogleImages | string>({
   bookImage,
   title,
   width = 135,
   height = 185,
   priority,
   forwardedRef,
   onMouseEnter,
   onMouseLeave,
   className,
   ...restProps
}: BookImageProps<T>) => {
   const imageSrc = typeof bookImage === 'string' ? bookImage : getAvailableThumbnail(bookImage);
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
            src={imageSrc}
            alt={`Picture of ${title} cover`}
            priority={priority}
            width={width}
            height={height}
            {...restProps}
         />
      </div>
   );
};

export default BookImage;
