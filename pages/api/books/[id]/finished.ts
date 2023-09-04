import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
// TESTING IMPORTS
import {
  BookGetter,
  FinishedGetter,
} from "../../../../lib/prisma/class/get/bookgetter";
import FinishedCreator from "../../../../lib/prisma/class/create/finished";
import ReadingEditor from "../../../../lib/prisma/class/edit/editDeleter";
import BookEditor from "../../../../lib/prisma/class/edit/bookeditor";

// this means also updating finishedBooks DATES if date is NULL
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id: userId } = req.query;
    const getter = new BookGetter(userId as string);
    try {
      const userLibrary = await getter.getAllBooks();
      return res.status(200).json(userLibrary);
    } catch (err) {
      return res.status(404).end(err);
    }
  }
  // there should be two different deletes?
  if (req.method === "POST") {
    const {
      userId,
      year,
      month,
      day,
      industryIdentifiers,
      authors,
      imageLinks,
      categories,
      ...data
    } = req.body;

    const creator = new FinishedCreator(
      data,
      categories,
      authors,
      imageLinks,
      industryIdentifiers,
      userId
    );
    const finishedGetter = new FinishedGetter(userId);
    const editor = new ReadingEditor(userId, data.id);
    const isBookInFinished = await finishedGetter.isBookInFinished(data.id);
    try {
      // think of how this will work when reReading a book?
      // if book and reading contains LOG then soft delete
      if (isBookInFinished) {
        await Promise.race([await editor.deleteReading()]).then(
          async () => await creator.createFinished(year, month, day)
        );
      } else {
        await creator.createFinished(year, month, day);
      }
      return res.status(201).json({ success: true });
    } catch (err) {
      return res.end(err);
    }
  }
  if (req.method === "DELETE") {
    const { id, userId } = req.body;
    const editor = new BookEditor(id, userId);
    try {
      await Promise.race([
        await editor.deleteMany<"finished">(prisma.finished),
        await editor.deleteMany<"want">(prisma.want),
        await editor.deleteMany<"reading">(prisma.reading),
      ]);
      await prisma.book.delete({
        where: { id_userId: { id: id, userId: userId } },
      });
      return res
        .status(200)
        .json({ success: true, message: "Successfully deleted" });
    } catch (err) {
      return res.status(404).end(err);
    }
  } else {
    return res.status(500).json({ message: "Internal server error" });
  }
}
