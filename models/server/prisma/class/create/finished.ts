import { Data } from '../types';
import BookCreator from './books';
import prisma from '../../../../../lib/prisma';

export default class FinishedCreator extends BookCreator {
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
   async createFinished(year: number, month: number, day: number) {
      const data = new BookCreator(
         this.data,
         this.categories,
         this.authors,
         this.imageLinks,
         this.industryIdentifiers,
         this.userId
      ).connectOrCreateMethod;

      await prisma.finished.create({
         data: {
            book: data,
            finishedYear: year,
            finishedMonth: month,
            finishedDay: day,
         },
      });
   }
}
