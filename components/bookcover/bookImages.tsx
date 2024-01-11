import Image, { ImageProps } from 'next/image';
import { ImageLinks, ImageLinksPairs } from '@/lib/types/googleBookTypes';
import { getAvailableThumbnail } from '@/lib/helper/books/editBookPageHelper';
import clsx from 'clsx';
import Link from 'next/link';
import ROUTES from '@/utils/routes';
import { RouteParams } from '@/lib/types/routes';
import { forwardRef } from 'react';

type OmittedImageProps = Omit<ImageProps, 'src' | 'width' | 'height' | 'priority'>;
type GoogleImages = ImageLinksPairs | ImageLinks;

interface BookImageProps<T extends GoogleImages | string> extends OmittedImageProps {
   bookImage: T | undefined;
   title: string;
   width: number;
   height: number;
   priority: boolean;
   id: string;
   routeQuery?: RouteParams;
   isLinkHidden?: boolean;
   forwardedRef?: (el: HTMLDivElement) => void;
   onMouseEnter?: () => void;
   onMouseLeave?: (e: React.MouseEvent) => void;
   onLoadComplete?: (id: string) => void;
   className?: string;
}

const BookImage = forwardRef<React.ElementRef<'div'>, BookImageProps<GoogleImages | string>>(
   function BookImage(
      {
         bookImage,
         title,
         width = 135,
         height = 185,
         priority,
         id,
         routeQuery,
         isLinkHidden,
         forwardedRef,
         onMouseEnter,
         onMouseLeave,
         onLoadComplete,
         className,
         ...restProps
      },
      ref
   ) {
      const imageSrc = typeof bookImage === 'string' ? bookImage : getAvailableThumbnail(bookImage);
      const defaultStyle = 'inline-flex items-start justify-start mb-8';

      return (
         <div
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={className ? clsx(defaultStyle, className) : defaultStyle}
         >
            <Link
               hidden={isLinkHidden}
               href={{ pathname: `/books/[slug]`, query: routeQuery }}
               as={ROUTES.BOOKS.GOOGLE(id)}
               aria-label={`Link to book: ${title}`}
            >
               <Image
                  src={imageSrc}
                  alt={`Picture of ${title} cover`}
                  priority={priority}
                  width={width}
                  height={height}
                  // onLoadingComplete={() => onLoadComplete && onLoadComplete(id)}
                  onLoadingComplete={() => onLoadComplete && onLoadComplete(id)}
                  {...restProps}
               />
            </Link>
         </div>
      );
   }
);

export default BookImage;
