// import prisma from "../../prisma";
// import { BookCreator, Data } from "./bookCreator";
// import { isLibraryId } from "../../helper/oop/libraryExists";

// // change the condition to isLibraryId(this.libraryId);
// export class BookUpdater extends BookCreator {
//   libraryId: string | undefined;
//   constructor(
//     data: Data,
//     industryIdentifiers: string[],
//     authors: string[],
//     imageLinks: { thumbnail: string; smallThumbnail: string },
//     categories: string[],
//     userId: string,
//     libraryId: string | undefined
//   ) {
//     super(data, industryIdentifiers, authors, imageLinks, categories, userId);
//     this.libraryId = libraryId;
//   }
//   // should remove primary or no?
//   async createOrUpdateToReading() {
//     if (isLibraryId(this.libraryId)) {
//       await prisma.library.update({
//         where: { id: this.libraryId },
//         data: {
//           wantToRead: false,
//           currentlyReading: true,
//           // readingAdded: new Date(),
//         },
//       });
//     } else {
//       super.addData(false);
//     }
//   }
//   async createOrUpdateToFinished(
//     year: number,
//     month: number,
//     day: number
//     // libraryId: string | undefined
//   ) {
//     if (isLibraryId(this.libraryId)) {
//       await prisma.library.update({
//         where: { id: this.libraryId },
//         data: {
//           finishedReading: true,
//           finishedYear: year,
//           finishedMonth: month,
//           finishedDay: day,
//           primary: false,
//           wantToRead: false,
//         },
//       });
//     } else {
//       await super.addFinishedData(year, month, day);
//     }
//   }
//   async createOrUpdateToWantToRead() {
//     if (isLibraryId(this.libraryId)) {
//       await prisma.library.update({
//         where: { id: this.libraryId },
//         data: {
//           finishedReading: false,
//           primary: false,
//           wantToRead: true,
//           wantToReadLastUpdate: new Date(),
//         },
//       });
//     } else {
//       super.addData(true);
//     }
//   }
//   // this should not be "created" but ONLY updated?
//   async createOrUpdatePrimaryReading() {
//     if (isLibraryId(this.libraryId)) {
//       await prisma.library.update({
//         where: { id: this.libraryId },
//         data: {
//           primary: true,
//           primaryAdded: new Date(),
//           currentlyReading: true,
//           wantToRead: false,
//           // not sure about this since the user can re-read the book
//           finishedReading: false,
//         },
//       });
//     } else {
//       return super.addData(false);
//     }
//   }
// }
