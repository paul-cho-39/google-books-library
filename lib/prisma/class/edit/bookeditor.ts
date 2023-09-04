import { PrismaClient } from "@prisma/client";

export default class BookEditor {
  userId: string;
  id: string;
  constructor(userId: string, id: string) {
    this.id = id;
    this.userId = userId;
  }
  get whereData() {
    return { bookId_userId: { bookId: this.id, userId: this.userId } };
  }
  get deleteManyData() {
    return { AND: [{ bookId: this.id }, { userId: this.userId }] };
  }
  async deleteBook<T extends "finished" | "want" | "reading">(
    prismaModel: PrismaClient[T]
  ) {
    const whereData = new BookEditor(this.id, this.userId).whereData;
    // @ts-ignore
    await prismaModel.delete({
      where: whereData,
    });
  }
  async deleteMany<T extends "finished" | "want" | "reading">(
    prismaModel: PrismaClient[T]
  ) {
    const deleteData = new BookEditor(this.id, this.userId).deleteManyData;
    // @ts-ignore
    await prismaModel.deleteMany({
      where: deleteData,
    });
  }
}
