import { BookCardProps } from '@/lib/types/components/bookcards';
import { Library } from '@/lib/types/models/books';

import BookTitleAndAuthor from './titleAndAuthor';
import BookActionButton from '../../buttons/bookActionButton';
import FilterStatus from './filterStatus';

interface BookDetailsProps extends Omit<BookCardProps, 'totalItems'> {
   dataBooks: Library | undefined;
}

const BookDetails = ({ book, query, userId, dataBooks }: BookDetailsProps) => (
   <div className='relative grid grid-rows-5 px-4 md:px-6 lg:px-8'>
      <BookTitleAndAuthor book={book} query={query} />
      <BookActionButton book={book} userId={userId} />
      <FilterStatus bookId={book.id} library={dataBooks} />
   </div>
);

export default BookDetails;
