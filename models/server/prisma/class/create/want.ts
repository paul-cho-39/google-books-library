import { Data } from '../types';
import BookCreator from './Books';
import prisma from '../../../prisma';

export default class WantToReadCreator extends BookCreator {
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
   async createWant() {
      const data = new BookCreator(
         this.data,
         this.categories,
         this.authors,
         this.imageLinks,
         this.industryIdentifiers,
         this.userId
      ).connectOrCreateMethod;
      await prisma.want.create({
         data: {
            book: data,
         },
      });
   }
   async updateWant() {
      await prisma.reading.delete({
         where: { bookId_userId: { userId: this.userId, bookId: this.data.id } },
      });
      await prisma.reading.delete({
         where: { bookId_userId: { userId: this.userId, bookId: this.data.id } },
      });
      await prisma.reading.deleteMany({
         where: { AND: [{ bookId: this.data.id }, { userId: this.userId }] },
      });
   }
}
