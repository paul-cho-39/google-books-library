import { Data } from '@/lib/types/models/books';
import { DataAnalyzer } from '../decorator/Analyzer';
import { RefineData } from '../decorator/RefineData';
import BookCreator, { UserBookWithoutId } from '../prisma/BookCreator';
import BookDelete from '../prisma/BookDelete';
import { BookRetriever } from '../prisma/BookRetrieve';
import BookStateHandler from '../prisma/BookState';
import Books from '../prisma/Books';

// maybe add another layer to the bookService that can be inherited some base?
// for now this is set as a singleton and service layer that serves all endpont
export default class BookService {
   private retriever: BookRetriever;
   private refiner: RefineData;
   private analyzer: DataAnalyzer;
   private creator: BookCreator | null = null;
   private deleter: BookDelete | null = null;
   userId: string | null;
   bookId: string | null;
   constructor(userId?: string, bookId?: string) {
      this.refiner = new RefineData();
      this.retriever = new BookRetriever();
      this.analyzer = new DataAnalyzer();
      this.userId = userId || null;
      this.bookId = bookId || null;
   }
   get getCreator(): BookCreator {
      if (!this.creator) {
         this.checkIdsAndInit();
         this.creator = new BookCreator(this.userId!, this.bookId!);
      }
      return this.creator;
   }
   get getDeleter(): BookDelete {
      if (!this.deleter) {
         this.checkIdsAndInit();
         this.deleter = new BookDelete(this.userId!, this.bookId!);
      }
      return this.deleter;
   }

   setUserId(id: string) {
      if (this.userId) return;

      this.userId = id;
   }
   setBookId(id: string) {
      if (this.bookId) return;

      this.bookId = id;
   }
   checkIdsAndInit() {
      if (!this.userId || !this.bookId) {
         throw new Error('Required parameters userId and bookId is null or undefined');
      }
   }

   async handleCreateReading(data: Data) {
      const stateData = BookStateHandler.getBookState('Reading', { isPrimary: true });
      const creator = this.getCreator;
      await creator.createOrRecoverDeletedBook(data, stateData as UserBookWithoutId);
   }
   async handlePrimary() {
      const creator = this.getCreator;
      const stateData = BookStateHandler.getBookState('Reading', {
         isPrimary: false,
      });
      await creator.updateBookState(stateData as UserBookWithoutId);
   }
   async handleCreateWant(data: Data) {
      const creator = this.getCreator;
      const stateData = BookStateHandler.createWant();
      await creator.createOrRecoverDeletedBook(data, stateData as UserBookWithoutId);
   }
   async handleCreateFinished(data: Data, year?: number, month?: number, day?: number) {
      const creator = this.getCreator;

      const stateData = BookStateHandler.getBookState('Finished', {
         year,
         month,
         day,
      });
      await creator.createOrRecoverDeletedBook(data, stateData as UserBookWithoutId);
   }
   async handleCreateBookAndRating(data: Data, rating: number) {
      const creator = this.getCreator;
      await creator.upsertBookAndRating(data, rating);
   }
   async handleUpdateRating(rating: number) {
      const creator = this.getCreator;
      await creator.updateRatings(rating);
   }
   async getAllRatingOfSingleBook(bookId?: string) {
      this.ensureBookIdIsSet(bookId);

      // this wont be affected by soft delete
      // rating / comments only requires the book to be in data
      // and using the method 'isBookInLibrary' is okay
      try {
         const data = await Promise.all([
            this.retriever.getRatingByBook(this.bookId!),
            this.retriever.isBookInLibrary(this.bookId!),
         ]);

         const count = this.analyzer.getTotal(data[0]);
         const avg = this.analyzer.getAverage(data[0]);

         return {
            ratingInfo: data[0],
            count: count,
            avg: avg,
            inLibrary: !!data[1],
         };
      } catch (err) {
         console.error('Failed to retrieve book rating data', err);
         throw err;
      }
   }

   async getUserBooks(userId?: string) {
      this.ensureUserId(userId);
      const userBooks = await this.retriever.getAllValidUserBooks(this.userId!);
      const refinedBooks = this.refiner.refineBooks(userBooks);
      return refinedBooks;
   }
   async deleteBook() {
      const deleter = this.getDeleter;
      await deleter.deleteBook();
   }
   async deleteSingleRating() {
      const deleter = this.getDeleter;

      // maybe implement deleting the book as well
      // if so, have to reroute API endpoint and change https verb from 'delete' to 'post' and
      // with new returned values including 'inLibrary'.
      // Also, change the logic of useMutateRating, change getRatingInfo method of case, 'removed'
      // which will toggle inLibrary to false from the response it gets

      // await deleter.deleteRatingAndBook();

      await deleter.deleteRating();
   }

   private ensureUserId(userId?: string) {
      if (userId) {
         this.setUserId(userId);
      }

      if (!this.userId) {
         throw new Error('User ID is not set.');
      }
   }
   private ensureBookIdIsSet(bookId?: string): void {
      if (bookId) {
         this.setBookId(bookId);
      }

      if (!this.bookId) {
         throw new Error('Book ID is not set.');
      }
   }
}
