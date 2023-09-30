import BookCreator from './Books';
import prisma from '../../../../../lib/prisma';
import { Data } from '../../../../../lib/types/models/books';

export default class FinishedCreator extends BookCreator {
   constructor(
      data: Data,
      industryIdentifiers: string[],
      authors: string[],
      categories: string[],
      userId: string
   ) {
      super(data, industryIdentifiers, authors, categories, userId);
   }
   async createFinished(year: number, month: number, day: number) {
      await prisma.userBook.create({
         data: {
            bookId: this.data.id,
            userId: this.userId,
            dateFinished: new Date(year, month, day), 
            state: 'Finished',
            book {}       
         }
      })
   }
}
