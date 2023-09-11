import Link from 'next/link';
import { transformStrToArray } from '../../utils/transformChar';

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
}: AuthorProps<T>) => {
   const transformedAuthor =
      typeof authors === 'string' ? transformStrToArray(authors) : (authors as string[]);
   const numberOfAuthors = transformedAuthor?.length;

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

const MultipleAuthors = ({ authors, indexLimit = 3, textLimit }: AuthorProps<string[]>) => (
   <>
      {authors.map((author, index) => (
         <Link key={index} href={`/author/${author}`} passHref>
            <a
               className={`after:content-[', '] last-of-type:after:content-[''] ${
                  index >= indexLimit ? 'hidden' : ''
               }`}
            >
               {author}
            </a>
         </Link>
      ))}
   </>
);

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
