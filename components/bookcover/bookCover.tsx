import { ImageLinks, SingleBook } from "../../lib/types/googleBookTypes";
import SingleOrMultipleAuthors from "../bookcards/getEachAuthor";
import { filterDates } from "../../lib/helper/books/editBookPageHelper";
import BookImage from "./bookImages";
import Categories from "./categories";
import BookDescription from "./description";

export type BookDataProps = {
  bookData: SingleBook;
  children: React.ReactNode;
};

const BookCover = ({ bookData, children }: BookDataProps) => {
  const getPublisherDate = filterDates(bookData.publishedDate);

  return (
    <div className="mx-auto px-2 pt-4">
      {/* image have div parent */}
      <BookImage
        bookImage={bookData.imageLinks as ImageLinks}
        title={bookData.title}
      />
      <div>
        <div>
          <h1 className="font-semibold text-lg font-serif">
            {bookData.title}: <span>{bookData.subtitle}</span>
          </h1>
        </div>
        <div className="text-black not-first:underline not-first:underline-offset-2 ">
          <span>By: </span>
          <SingleOrMultipleAuthors authors={bookData.authors} />
        </div>
        <div className="divide-y-2 divide-slate-300">
          {/* children for buttons */}
          {children}
        </div>
        <div role="contentinfo" id="book-info" className="my-4">
          <h3>About {bookData.title} </h3>
          <BookDescription description={bookData.description} />
          <Categories categories={bookData.categories} />
        </div>
      </div>
    </div>
  );
};

export default BookCover;
