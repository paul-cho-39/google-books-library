import prisma from "../../prisma";
import { Prisma, PrismaClient } from "@prisma/client";

// type UniqueLibrary = { id: string };
// if not extending there is no reason to have libraryId here?

export class Library<T extends string | null, P extends string | undefined> {
  libraryId: T | null;
  userId: Prisma.StringFilter;
  id: Prisma.StringFilter | P;
  constructor(
    userId: Prisma.StringFilter,
    id: Prisma.StringFilter,
    libraryId?: string | null
  ) {
    this.userId = userId;
    this.id = id;
    this.libraryId = null;
  }
  async findUnique(): Promise<string[]> {
    const libraryId = await prisma.library.findMany({
      where: {
        AND: [
          { userId: this.userId },
          {
            books: {
              every: {
                id: this.id,
              },
            },
          },
        ],
      },
      select: { id: true },
    });
    return libraryId.map((lib) => lib.id);
  }
  async uniqueIdToString() {
    const library = await this.findUnique();
    const lib = new Library(
      this.userId as Prisma.StringFilter,
      this.id as Prisma.StringFilter
    );
    lib.libraryId = library.toString();

    return library.toString();
  }
  async deleteFromData(libraryId: string) {
    await prisma.library.delete({
      where: { id: libraryId },
    });
  }
  async findDuplicatePrimaryBook() {
    return await prisma.book.findMany({
      where: {
        AND: [
          { id: this.id, userId: this.userId },
          { library: { primary: true } },
        ],
      },
    });
  }
}

// hoping to have the basis
// and extend the class? would this work?
