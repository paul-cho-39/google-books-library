import BookEditor from "./bookeditor";
import prisma from "../../../prisma";

export default class EditUpdater extends BookEditor {
  constructor(userId: string, id: string) {
    super(userId, id);
  }
  async switchPrimary() {
    const whereData = new BookEditor(this.id, this.userId).whereData;
    await prisma.reading.updateMany({
      where: { AND: [{ userId: this.userId }, { primary: true }] },
      data: {
        primary: false,
      },
    });
    await prisma.reading.update({
      where: whereData,
      data: { primary: true },
    });
  }
}
