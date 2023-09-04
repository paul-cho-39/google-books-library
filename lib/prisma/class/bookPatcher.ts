// import prisma from "../../prisma";
// import { isLibraryId } from "../../helper/oop/libraryExists";

// export class BookPatcher {
//   libraryId: string;
//   constructor(libraryId: string) {
//     this.libraryId = libraryId;
//   }
//   async removePrimary() {
//     await prisma.library.update({
//       where: { id: this.libraryId },
//       data: {
//         primary: false,
//         primaryAdded: new Date(),
//       },
//     });
//   }
//   async removeCurrentlyReading() {
//     await prisma.library.update({
//       where: { id: this.libraryId },
//       data: {
//         currentlyReading: false,
//       },
//     });
//   }
//   async removeWantToRead() {
//     await prisma.library.update({
//       where: { id: this.libraryId },
//       data: {
//         wantToRead: false,
//       },
//     });
//   }
//   async selectPrimary() {
//     // unless for each bookmark there is ONE primary
//     // otherwise whenever one primary book is true the other book turns false
//     await prisma.library.update({
//       where: { id: this.libraryId },
//       data: {
//         primary: true,
//         primaryAdded: new Date(),
//       },
//     });
//   }
//   async changePrimary(userId: string) {
//     await prisma.library.updateMany({
//       where: { AND: [{ userId: userId }, { primary: true }] },
//       data: {
//         primary: false,
//         primaryAdded: new Date(),
//       },
//     });
//   }
// }
