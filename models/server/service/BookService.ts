import { Data } from '../../../lib/types/models/books';
import { RefineData } from '../decorator/RefineData';
import BookCreator, { UserBookWithoutId } from '../prisma/BookCreator';
import BookDelete from '../prisma/BookDelete';
import { BookRetriever } from '../prisma/BookRetrieve';
import BookStateHandler from '../prisma/BookState';
import Books from '../prisma/Books';

// maybe add another layer to the bookService that can be inherited some base?
export default class BookService extends Books {
   creator: BookCreator;
   deleter: BookDelete;
   constructor(
      userId: string,
      bookId: string,
      private refiner: RefineData,
      private retriever: BookRetriever
   ) {
      super(userId, bookId);
      this.creator = new BookCreator(this.userId, this.bookId);
      this.deleter = new BookDelete(this.userId, this.bookId);
   }

   async handleCreateReading(data: Data) {
      const stateData = BookStateHandler.getBookState('Reading', { isPrimary: true });
      await this.creator.createOrUpdateBookAndState(data, stateData as UserBookWithoutId);
   }
   async handlePrimary() {
      const stateData = BookStateHandler.getBookState('Reading', {
         isPrimary: false,
      });
      await this.creator.updateBookState(stateData as UserBookWithoutId);
   }
   async handleCreateWant(data: Data) {
      const stateData = BookStateHandler.createWant();
      await this.creator.createOrUpdateBookAndState(data, stateData as UserBookWithoutId);
   }
   async handleCreateFinished(data: Data, year?: number, month?: number, day?: number) {
      const stateData = BookStateHandler.getBookState('Finished', {
         year,
         month,
         day,
      });
      await this.creator.createOrUpdateBookAndState(data, stateData as UserBookWithoutId);
   }
   async getUserBooks() {
      const userBooks = await this.retriever.getAllUserBooks(this.userId);
      const refinedBooks = this.refiner.refineBooks(userBooks);
      return refinedBooks;
   }
   async deleteBook() {
      this.deleter.deleteBook();
   }
}

// const bookService = new BookService();
