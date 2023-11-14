import Link from 'next/link';
import { transformStrToArray } from '@/lib/helper/transformChar';
import classNames from 'classnames';
import { Fragment } from 'react';
import ROUTES from '@/utils/routes';

interface AuthorProps<T extends string[] | string> {
   authors: T;
   indexLimit?: number;
   textLimit?: number;
   hoverUnderline?: boolean;
   className?: string;
}

const SingleOrMultipleAuthors = <T extends string[] | string>({
   authors,
   indexLimit = 3,
   textLimit = 30,
   hoverUnderline,
   className,
}: Partial<AuthorProps<T>>) => {
   const transformedAuthor =
      typeof authors === 'string' ? transformStrToArray(authors) : (authors as string[]);
   const numberOfAuthors = transformedAuthor?.length;

   if (!authors || numberOfAuthors < 1) {
      return <span aria-readonly>Unknown author</span>;
   }

   if (!authors) {
      return (
         <div className='text-slate-800 dark:text-slate-100 pointer-events-none'>
            Unknown Author
         </div>
      );
   }

   return (
      <>
         {numberOfAuthors && numberOfAuthors > 1 ? (
            <MultipleAuthors
               className={classNames(
                  hoverUnderline &&
                     'text-blue-600 hover:underline-offset-1 hover:underline hover:decoration-blue-400 hover:dark:decoration-blue-200',
                  className
               )}
               authors={transformedAuthor}
               indexLimit={indexLimit}
               textLimit={textLimit}
            />
         ) : (
            <SingleAuthor
               className={classNames(
                  hoverUnderline &&
                     'text-blue-600 hover:underline-offset-1 hover:underline hover:decoration-blue-400 hover:dark:decoration-blue-200',
                  className
               )}
               authors={transformedAuthor}
               textLimit={textLimit}
            />
         )}
      </>
   );
};

// include hovered or not?
const MultipleAuthors = ({
   authors,
   indexLimit = 3,
   textLimit,
   className,
}: AuthorProps<string[]>) => {
   const numOfAuthors = authors.length;
   return (
      <>
         {authors.slice(0, indexLimit).map((author, index) => (
            <Fragment key={index}>
               <Link href={ROUTES.AUTHORS(author)} passHref>
                  <a className={classNames(index >= indexLimit ? 'hidden' : className)}>{author}</a>
               </Link>
               <span className='text-slate-800 dark:text-slate-100'>
                  {index < Math.min(numOfAuthors, indexLimit) - 1 ? ', ' : ''}
               </span>
            </Fragment>
         ))}
      </>
   );
};

const SingleAuthor = ({
   authors,
   textLimit,
   className,
}: Exclude<AuthorProps<string[]>, 'indexLimit'>) => {
   const authorToString = authors.join(', ');
   return (
      <Link href={ROUTES.AUTHORS(authorToString)} passHref>
         <a className={className}>
            {authorToString.length < (textLimit || 30)
               ? authorToString
               : `${authorToString.slice(0, textLimit || 30)}...`}
         </a>
      </Link>
   );
};

export default SingleOrMultipleAuthors;
