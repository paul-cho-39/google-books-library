import Link from 'next/link';
import { LineClamp } from './description';
import classNames from 'classnames';

interface BookTitleProps {
   id: string;
   title: string;
   subtitle?: string;
   lineClamp?: LineClamp;
   hasLink?: boolean;
   fromPage?: string;
   className?: string;
}

const BookTitle = ({
   id,
   title,
   subtitle,
   lineClamp = 'line-clamp-2',
   hasLink = true,
   fromPage,
   className,
}: BookTitleProps) => {
   const content = (
      <a className={`${lineClamp} text-ellipsis`}>
         <span className='sr-only'>
            {title}: {subtitle}
         </span>
         {subtitle ? title + ': ' + subtitle : title}
      </a>
   );
   return (
      <h3 className={classNames('font-medium py-1 text-slate-800 dark:text-slate-100', className)}>
         {hasLink ? (
            <Link
               as={`/books/${id}`}
               href={{ pathname: '/books/[slug]/', query: { from: fromPage } }}
               passHref
            >
               {content}
            </Link>
         ) : (
            content
         )}
      </h3>
   );
};

export default BookTitle;
