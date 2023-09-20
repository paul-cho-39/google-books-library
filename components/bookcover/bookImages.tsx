import Image, { ImageProps } from 'next/image';
import { ImageLinks, ImageLinksPairs } from '../../lib/types/googleBookTypes';
import { getAvailableThumbnail } from '../../lib/helper/books/editBookPageHelper';
import clsx from 'clsx';
import classNames from 'classnames';
import { ForwardRefRenderFunction, useEffect, useState } from 'react';
import Link from 'next/link';

type OmittedImageProps = Omit<ImageProps, 'src' | 'width' | 'height' | 'priority'>;
type GoogleImages = ImageLinksPairs | ImageLinks;

interface BookImageProps<T extends GoogleImages | string> extends OmittedImageProps {
   bookImage: T | undefined;
   title: string;
   width: number;
   height: number;
   priority: boolean;
   id?: string;
   fromPage?: string;
   isLinkHidden?: boolean;
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
   id,
   fromPage,
   isLinkHidden,
   forwardedRef,
   onMouseEnter,
   onMouseLeave,
   className,
   ...restProps
}: BookImageProps<T>) => {
   const imageSrc = typeof bookImage === 'string' ? bookImage : getAvailableThumbnail(bookImage);
   const defaultStyle = 'w-full inline-flex items-start justify-start mb-8';

   return (
      <div
         ref={forwardedRef}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
         className={className ? clsx(defaultStyle, className) : defaultStyle}
      >
         <Link
            hidden={isLinkHidden}
            href={{ pathname: `/books/[slug]`, query: { from: fromPage } }}
            as={`/books/${id}`}
         >
            <Image
               src={imageSrc}
               alt={`Picture of ${title} cover`}
               priority={priority}
               width={width}
               height={height}
               {...restProps}
            />
         </Link>
      </div>
   );
};

export default BookImage;
