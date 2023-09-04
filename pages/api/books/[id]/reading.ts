import type { NextApiRequest, NextApiResponse } from "next";
import { Library } from "../../../../lib/prisma/class/library";
import CurrentReadingCreator from "../../../../lib/prisma/class/create/reading";
import { ReadingGetter } from "../../../../lib/prisma/class/get/bookgetter";

import ReadingEditor from "../../../../lib/prisma/class/edit/editDeleter";
import BookEditor from "../../../../lib/prisma/class/edit/bookeditor";
import { Prisma } from "@prisma/client";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // make sure that it doesnt add duplicates
    const {
      userId,
      categories,
      authors,
      imageLinks,
      industryIdentifiers,
      ...data
    } = req.body;
    const reading = new CurrentReadingCreator(
      data,
      categories,
      authors,
      imageLinks,
      industryIdentifiers,
      userId
    );
    const readEditor = new ReadingEditor(userId, data.id);
    try {
      reading.createReading();
      // return a message of first pimary? which can trigger an event?
      return res.status(201).json({
        success: true,
        // data: {
        //   type: numberOfRead < 1 ? "primary" : "currently reading",
        // },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P3000"
      ) {
        console.log(
          "The data cannot be created. Check unique constraints or so that it satisfies foreign constraints"
        );
      }
    }
  }
  if (req.method === "DELETE") {
    // TODO //
    // if the book being deleted is primary (getter) AND more than one
    // update the primary that was added (stack)
    const { id, userId } = req.body;
    const editor = new ReadingEditor(id, userId);
    const readGetter = new ReadingGetter(userId);
    const isBookInReading = await readGetter.isBookInReading(id);
    try {
      // TODO
      // if finished contains logs then ONLY delete from want
      // PROBLEM since if finished is NOT deleted then what happens?
      // **this is not SAFE way or will delete finished
      if (isBookInReading?.id) {
        await Promise.all([
          await editor.deleteFinished(),
          await editor.deleteWanted(),
        ]);
      } else {
        await editor.deleteReading();
      }
      return res
        .status(200)
        .json({ success: true, message: "Successfully deleted from reading" });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        console.log(
          "Cannot find the data inside 'reading', 'finished', or in 'want' "
        );
      }
      return res.status(404).end(err);
    }
  } else {
    return res.status(500).end({ message: "Internal Server Error" });
  }
}
