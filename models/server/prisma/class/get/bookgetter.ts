import prisma from "../../../prisma";
import { Prisma, PrismaClient } from "@prisma/client";

export class BookGetter {
  userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }
  async getIdsForBook<T extends "finished" | "want" | "reading">(
    prismaModel: PrismaClient[T]
  ): Promise<string[]> {
    //@ts-ignore
    const books = await prismaModel.findMany({
      where: { userId: this.userId },
      select: { bookId: true },
    });
    return books.map((book: { bookId: string }) => book.bookId);
  }
  // may need it?
  async isBookInLib(bookId: string) {
    const isBookInLib = await prisma.book.findMany({
      where: {
        AND: [
          { NOT: [{ reading: { bookId: bookId, userId: this.userId } }] },
          { NOT: [{ finished: { bookId: bookId, userId: this.userId } }] },
          { NOT: [{ want: { bookId: bookId, userId: this.userId } }] },
        ],
      },
      select: { id: true },
    });
    return isBookInLib;
  }
  async getAllBooks() {
    // for concurrently fetching all books
    const books = await Promise.all([
      await this.getIdsForBook<"finished">(prisma.finished),
      await this.getIdsForBook<"want">(prisma.want),
      await this.getIdsForBook<"reading">(prisma.reading),
    ]);
    return {
      library: {
        finished: books[0],
        wantToRead: books[1],
        currentlyReading: books[2],
      },
    };
  }
}

export class ReadingGetter {
  userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }
  // this should be AND later when bookmarkId is given
  async count() {
    return await prisma.reading.count({
      where: { userId: this.userId },
    });
  }
  // how would this playout whenever creating a bookmark?
  //   should add bookmark?
  async getEditPrimaryData() {
    return await prisma.reading.findMany({
      where: { userId: this.userId ?? undefined },
      select: {
        primary: true,
        book: {
          select: {
            id: true,
            title: true,
            authors: true,
            imageLinks: true,
          },
        },
      },
    });
  }
  async isBookInReading(bookId: string) {
    return await prisma.book.findFirst({
      where: {
        AND: [
          { id: bookId, userId: this.userId },
          { NOT: [{ reading: { bookId: bookId } }] },
        ],
      },
      select: { id: true },
    });
  }
}

export class FinishedGetter {
  userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }
  async isBookInFinished(bookId: string) {
    return await prisma.book.findFirst({
      where: {
        AND: [
          { id: bookId, userId: this.userId },
          { NOT: [{ finished: { bookId: bookId } }] },
        ],
      },
      select: { id: true },
    });
  }
}
