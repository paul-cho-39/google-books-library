import Link from 'next/link';
import { transformStrToArray } from '../../utils/transformChar';
import classNames from 'classnames';
import { Fragment } from 'react';

type Authors = string[];

interface AuthorProps<T extends string[] | string> {
   authors: T;
   indexLimit?: number;
   textLimit?: number;
}

const SingleOrMultipleAuthors = <T extends string[] | string>({
   authors,
   indexLimit = 3,
   textLimit = 30,
}: Partial<AuthorProps<T>>) => {
   const transformedAuthor =
      typeof authors === 'string' ? transformStrToArray(authors) : (authors as string[]);
   const numberOfAuthors = transformedAuthor?.length;

   if (!authors || numberOfAuthors < 1) {
      return <span>Unknown author</span>;
   }

   return (
      <>
         {numberOfAuthors && numberOfAuthors > 1 ? (
            <MultipleAuthors
               authors={transformedAuthor}
               indexLimit={indexLimit}
               textLimit={textLimit}
            />
         ) : (
            <SingleAuthor authors={transformedAuthor} textLimit={textLimit} />
         )}
      </>
   );
};

// include hovered or not?
const MultipleAuthors = ({ authors, indexLimit = 3, textLimit }: AuthorProps<string[]>) => {
   const numOfAuthors = authors.length;
   return (
      <>
         {authors.slice(0, indexLimit).map((author, index) => (
            <Fragment key={index}>
               <Link href={`/author/${author}`} passHref>
                  <a
                     className={classNames(
                        index >= indexLimit ? 'hidden' : '',

                        'hover:text-opacity-80'
                     )}
                  >
                     {author}
                  </a>
               </Link>
               {index < Math.min(numOfAuthors, indexLimit) - 1 ? ', ' : ''}
            </Fragment>
         ))}
      </>
   );
};

const SingleAuthor = ({ authors, textLimit }: Exclude<AuthorProps<string[]>, 'indexLimit'>) => {
   const authorToString = authors.join(', ');
   return (
      <Link href={`/author/${authorToString}`} passHref>
         <a>
            {authorToString.length < (textLimit || 30)
               ? authorToString
               : `${authorToString.slice(0, textLimit || 29)}...`}
         </a>
      </Link>
   );
};

export default SingleOrMultipleAuthors;
