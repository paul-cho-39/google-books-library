import Link from "next/link";

type Authors = string[];

const SingleOrMultipleAuthors: React.FunctionComponent<{
  authors: Authors;
}> = ({ authors }) => {
  const numberOfAuthors = authors?.length;
  const authorToString = authors?.toString();
  return (
    <>
      {numberOfAuthors && numberOfAuthors > 1 ? (
        <>
          {authors?.map((author, index) => (
            <Link
              key={index}
              href="/author/[slug]"
              as={`/author/${author}`}
              passHref
            >
              <a className=" after:content-[',_'] last-of-type:after:content-[''] text-ellipsis">
                {index < 3 ? author : "..."}
              </a>
            </Link>
          ))}
        </>
      ) : (
        <Link
          href="/author/[slug]"
          as={`/author/${authors}`}
          scroll={false}
          passHref
        >
          <a className="text-clip">
            {authors && authorToString.length < 30
              ? authorToString
              : authorToString?.slice(0, 29) + "..."}
          </a>
        </Link>
      )}
    </>
  );
};

export default SingleOrMultipleAuthors;
