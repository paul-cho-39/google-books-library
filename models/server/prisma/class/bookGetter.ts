// import prisma from "../../prisma";

// export class BookGetter {
//   userId: string;
//   constructor(userId: string) {
//     this.userId = userId;
//   }
//   async getFinishedBooks() {
//     const userFinishedBooks = await prisma.book.findMany({
//       where: {
//         AND: [
//           {
//             library: {
//               finishedReading: true,
//               userId: { equals: this.userId },
//             },
//           },
//         ],
//       },
//       select: { id: true },
//     });
//     return userFinishedBooks.map((book) => book.id);
//   }
//   async getPrimaryBooks() {
//     const usersPrimaryBooks = await prisma.book.findMany({
//       where: {
//         AND: [
//           {
//             library: {
//               primary: true,
//               userId: { equals: this.userId },
//             },
//           },
//         ],
//       },
//       select: { id: true },
//     });
//     return usersPrimaryBooks.map((book) => book.id);
//   }
//   async getWantToReadBooks() {
//     const userWantToReadBooks = await prisma.book.findMany({
//       where: {
//         AND: [
//           {
//             library: {
//               wantToRead: true,
//               userId: { equals: this.userId },
//             },
//           },
//         ],
//       },
//       select: { id: true },
//     });
//     return userWantToReadBooks.map((book) => book.id);
//   }
//   async getCurrentlyReadingBooks() {
//     const currentlyReadingBooks = await prisma.book.findMany({
//       where: {
//         AND: [
//           {
//             library: {
//               currentlyReading: true,
//               userId: { equals: this.userId },
//             },
//           },
//         ],
//       },
//       select: { id: true },
//     });
//     return currentlyReadingBooks.map((book) => book.id);
//   }
//   // get primary books as well
//   // and likely move this to another class
//   async getAllBooks() {
//     const bookGetter = new BookGetter(this.userId);
//     const finishedBooks = await bookGetter.getFinishedBooks();
//     const wantToReadBooks = await bookGetter.getWantToReadBooks();
//     const currentlyReadingBooks = await bookGetter.getCurrentlyReadingBooks();
//     return {
//       library: {
//         finished: finishedBooks,
//         wantToRead: wantToReadBooks,
//         currentlyReading: currentlyReadingBooks,
//       },
//     };
//   }
//   // what would happen if user wants to record more than two books?
//   // TEST whehter AND OPERAND is necessary here
//   async getCurrentOrPrimary() {
//     return await prisma.book.findMany({
//       where: {
//         OR: [
//           {
//             AND: [
//               {
//                 library: {
//                   currentlyReading: true,
//                   userId: { equals: this.userId },
//                 },
//               },
//             ],
//           },
//           {
//             AND: [
//               {
//                 library: {
//                   primary: true,
//                   userId: { equals: this.userId },
//                 },
//               },
//             ],
//           },
//         ],
//       },
//       select: {
//         id: true,
//         title: true,
//         authors: true,
//         imageLinks: true,
//         library: {
//           select: { primary: true, currentlyReading: true },
//         },
//       },
//     });
//   }
// }
