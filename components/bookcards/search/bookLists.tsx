import BookImage from '@/components/bookcover/bookImages';
import { getBookWidth } from '@/lib/helper/books/getBookWidth';
import BookDetails from './details';
import { encodeRoutes } from '@/utils/routes';
import { BookCardProps } from '@/lib/types/components/bookcards';
import { Library } from '@/lib/types/models/books';

type OmittedBookCards = Omit<BookCardProps, 'totalItems'>;
type BookListemItemProps = OmittedBookCards & {
   dataBooks: Library | undefined;
};

const HEIGHT = 125;

const BookListItem = ({ book, query, userId, dataBooks }: BookListemItemProps) => (
   <li role='listitem' key={book?.id}>
      <div className='flex items-start px-2 py-4'>
         {/* Book Image */}
         <div role='presentation' className='flex-shrink-0'>
            <BookImage
               id={book.id}
               bookImage={book.volumeInfo.imageLinks}
               height={HEIGHT}
               width={getBookWidth(HEIGHT)}
               priority
               title={book.volumeInfo.title}
               routeQuery={encodeRoutes.search(query)}
            />
         </div>
         {/* Book Details */}
         <BookDetails book={book} query={query} userId={userId} dataBooks={dataBooks} />
      </div>
   </li>
);

export default BookListItem;
