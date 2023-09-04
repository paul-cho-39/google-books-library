import { Items } from "../../lib/types/googleBookTypes";

const BookSearchSkeleton: React.FunctionComponent<{
  books: Array<Items<any>> | undefined;
}> = ({ books }) => {
  return (
    <>
      {books &&
        books?.map((book) => (
          <div
            key={book.id}
            role="status"
            className="bg-white mt-14 space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
          >
            <div className="flex items-start px-2 py-4 md:grid md:grid-cols-3 md:px-28">
              <div className="w-48 pr-8 h-48 bg-gray-300 rounded dark:bg-gray-700 md:col-span-1 lg:w-56"></div>
              <div className="w-full ml-6 lg:ml-1">
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ))}
    </>
  );
};

export default BookSearchSkeleton;
