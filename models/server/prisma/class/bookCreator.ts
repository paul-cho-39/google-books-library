// import prisma from "../../prisma";
// import { Prisma, PrismaClient } from "@prisma/client";

// // put this in another file?
// export type Data = {
//   id: string;
//   title: string;
//   subtitle: string;
//   publishedDate: Date;
//   language: string;
//   pageCount: number;
// };

// export class BookCreator {
//   data: Data;
//   industryIdentifiers: string[];
//   authors: string[];
//   imageLinks: { thumbnail?: string; smallThumbnail?: string };
//   categories: string[];
//   userId: string;
//   constructor(
//     data: Data,
//     categories: string[],
//     authors: string[],
//     imageLinks: { thumbnail: string; smallThumbnail: string },
//     industryIdentifiers: string[],
//     userId: string
//   ) {
//     this.data = data;
//     this.categories = categories;
//     this.authors = authors;
//     this.imageLinks = imageLinks;
//     this.industryIdentifiers = industryIdentifiers;
//     this.userId = userId;
//   }
//   async addData(isWantToRead: boolean = false) {
//     await prisma.library.create({
//       data: {
//         user: { connect: { id: this.userId } },
//         currentlyReading: isWantToRead ? false : true,
//         readingAdded: isWantToRead ? null : new Date(),
//         wantToRead: isWantToRead ? true : null,
//         wantToReadLastUpdate: isWantToRead ? new Date() : undefined,
//         books: {
//           create: {
//             id: this.data.id,
//             title: this.data.title,
//             subtitle: this.data.subtitle,
//             categories: this.categories ?? [],
//             authors: this.authors ?? [],
//             language: this.data.language,
//             publishedDate: new Date(this.data.publishedDate),
//             pageCount: this.data.pageCount,
//             imageLinks: this.imageLinks ?? Prisma.JsonNull,
//             industryIdentifiers:
//               (this.industryIdentifiers as Prisma.JsonArray) ?? Prisma.JsonNull,
//             userId: this.userId,
//           },
//         },
//       },
//     });
//   }
//   async addPrimary() {
//     await prisma.library.create({
//       data: {
//         user: { connect: { id: this.userId } },
//         currentlyReading: true,
//         readingAdded: new Date(),
//         primary: true,
//         primaryAdded: new Date(),
//         books: {
//           create: {
//             id: this.data.id,
//             title: this.data.title,
//             subtitle: this.data.subtitle,
//             categories: this.categories ?? [],
//             authors: this.authors ?? [],
//             language: this.data.language,
//             publishedDate: new Date(this.data.publishedDate),
//             pageCount: this.data.pageCount,
//             imageLinks: this.imageLinks ?? Prisma.JsonNull,
//             industryIdentifiers:
//               (this.industryIdentifiers as Prisma.JsonArray) ?? Prisma.JsonNull,
//             userId: this.userId,
//           },
//         },
//       },
//     });
//   }
//   async addFinishedData(year: number, month: number, day: number) {
//     await prisma.library.create({
//       data: {
//         user: { connect: { id: this.userId } },
//         finishedReading: true,
//         finishedYear: year,
//         finishedMonth: month,
//         finishedDay: day,
//         books: {
//           create: {
//             id: this.data.id,
//             title: this.data.title,
//             subtitle: this.data.subtitle,
//             categories: this.categories ?? [],
//             authors: this.authors ?? [],
//             language: this.data.language,
//             publishedDate: new Date(this.data.publishedDate),
//             pageCount: this.data.pageCount,
//             imageLinks: this.imageLinks ?? Prisma.JsonNull,
//             industryIdentifiers:
//               (this.industryIdentifiers as Prisma.JsonArray) ?? Prisma.JsonNull,
//             userId: this.userId,
//           },
//         },
//       },
//     });
//   }
// }
