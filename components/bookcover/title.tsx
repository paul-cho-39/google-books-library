import Link from 'next/link';
import { LineClamp } from './description';
import classNames from 'classnames';
import ROUTES from '@/utils/routes';
import { RouteParams } from '@/lib/types/routes';

interface BookTitleProps {
   id: string;
   title: string;
   subtitle?: string;
   lineClamp?: LineClamp;
   hasLink?: boolean;
   routeQuery?: RouteParams;
   className?: string;
}

const BookTitle = ({
   id,
   title,
   subtitle,
   lineClamp = 'line-clamp-2',
   hasLink = true,
   routeQuery,
   className,
}: BookTitleProps) => {
   const textContent = subtitle ? `${title}: ${subtitle}` : title;

   const content = (
      <span className={`${lineClamp} text-ellipsis`}>
         <span className='sr-only'>{textContent}</span>
         <span data-testid='visible-title'>{textContent}</span>
      </span>
   );

   return (
      <h3 className={classNames(className, 'font-medium py-1 text-slate-800 dark:text-slate-100')}>
         {hasLink ? (
            <Link
               as={ROUTES.BOOKS.GOOGLE(id)}
               href={{ pathname: '/books/[slug]/', query: routeQuery }}
            >
               <a role='link'>{content}</a>
            </Link>
         ) : (
            content
         )}
      </h3>
   );
};

export default BookTitle;
