import prisma from "../../../prisma";
import BookEditor from "./bookeditor";

// change the name? to EditDelete, EditUpdate,
// this code will change once figuring out how to retrieve the bookmark
export default class EditDeleter extends BookEditor {
  async deleteReading() {
    await super.deleteMany<"reading">(prisma.reading);
  }
  async deleteFinished() {
    await super.deleteMany<"finished">(prisma.finished);
  }
  async deleteWanted() {
    await super.deleteMany<"want">(prisma.want);
  }
}


