import prisma from "../../../prisma";
import { Want, Prisma, PrismaClient } from "@prisma/client";
import { Data } from "../types";

export default class BookCreator {
  data: Data;
  industryIdentifiers: string[];
  authors: string[];
  imageLinks: { thumbnail: string; smallThumbnail: string };
  categories: string[];
  userId: string;
  constructor(
    data: Data,
    categories: string[],
    authors: string[],
    imageLinks: { thumbnail: string; smallThumbnail: string },
    industryIdentifiers: string[],
    userId: string
  ) {
    this.data = data;
    this.categories = categories;
    this.authors = authors;
    this.imageLinks = imageLinks;
    this.industryIdentifiers = industryIdentifiers;
    this.userId = userId;
  }
  // when changing the data.id (for re-reading?) can use set to change
  // the bookId
  get connectOrCreateMethod() {
    return {
      connectOrCreate: {
        where: { id_userId: { id: this.data.id, userId: this.userId } },
        create: {
          user: { connect: { id: this.userId } },
          id: this.data.id,
          title: this.data.title,
          subtitle: this.data.subtitle,
          categories: this.categories ?? [],
          authors: this.authors ?? [],
          language: this.data.language,
          publishedDate: new Date(this.data.publishedDate),
          pageCount: this.data.pageCount,
          imageLinks: this.imageLinks ?? Prisma.JsonNull,
          industryIdentifiers:
            (this.industryIdentifiers as Prisma.JsonArray) ?? Prisma.JsonNull,
        },
      },
    };
  }
}
