import Link from 'next/link';

type Authors = string[];

interface AuthorProps {
   authors: string[];
   indexLimit?: number;
   textLimit?: number;
}

const SingleOrMultipleAuthors = ({ authors, indexLimit = 3, textLimit = 30 }: AuthorProps) => {
   const numberOfAuthors = authors?.length;

   return (
      <>
         {numberOfAuthors && numberOfAuthors > 1 ? (
            <MultipleAuthors authors={authors} indexLimit={indexLimit} textLimit={textLimit} />
         ) : (
            <SingleAuthor authors={authors} textLimit={textLimit} />
         )}
      </>
   );
};

const MultipleAuthors = ({ authors, indexLimit = 3, textLimit }: AuthorProps) => (
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

const SingleAuthor = ({ authors, textLimit }: Exclude<AuthorProps, 'indexLimit'>) => {
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

// const SingleOrMultipleAuthors: React.FunctionComponent<{
//   authors: Authors;
// }> = ({ authors }) => {
//   const numberOfAuthors = authors?.length;
//   const authorToString = authors?.toString();
//   return (
//     <>
//       {numberOfAuthors && numberOfAuthors > 1 ? (
//         <>
//           {authors?.map((author, index) => (
//             <Link
//               key={index}
//               href="/author/[slug]"
//               as={`/author/${author}`}
//               passHref
//             >
//               <a className=" after:content-[',_'] last-of-type:after:content-[''] text-ellipsis">
//                 {index < 3 ? author : "..."}
//               </a>
//             </Link>
//           ))}
//         </>
//       ) : (
//         <Link
//           href="/author/[slug]"
//           as={`/author/${authors}`}
//           scroll={false}
//           passHref
//         >
//           <a className="text-clip">
//             {authors && authorToString.length < 30
//               ? authorToString
//               : authorToString?.slice(0, 29) + "..."}
//           </a>
//         </Link>
//       )}
//     </>
//   );
// };

export default SingleOrMultipleAuthors;
