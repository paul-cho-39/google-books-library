import { Data } from '../types';
import BookCreator from './books';
import prisma from '../../../../../lib/prisma';
import { ReadingGetter } from '../get/bookgetter';

export default class CurrentReadingCreator extends BookCreator {
   constructor(
      data: Data,
      industryIdentifiers: string[],
      authors: string[],
      imageLinks: { thumbnail: string; smallThumbnail: string },
      categories: string[],
      userId: string
   ) {
      super(data, industryIdentifiers, authors, imageLinks, categories, userId);
   }
   async create(isPrimary: boolean = false) {
      const data = new BookCreator(
         this.data,
         this.categories,
         this.authors,
         this.imageLinks,
         this.industryIdentifiers,
         this.userId
      ).connectOrCreateMethod;

      await prisma.reading.create({
         data: {
            book: data,
            primary: isPrimary,
         },
      });
   }
   async createReading() {
      const reading = new ReadingGetter(this.userId);
      const numberOfRead = await reading.count();
      numberOfRead < 1 ? await this.create(true) : await this.create(false);
   }
   async connect() {
      await prisma.book.update({
         data: {
            reading: {
               connect: {
                  bookId_userId: { bookId: this.data.id, userId: this.userId },
               },
            },
         },
         where: {
            id_userId: { id: this.data.id, userId: this.userId },
         },
      });
   }
}
