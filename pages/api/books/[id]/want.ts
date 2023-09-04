import type { NextApiRequest, NextApiResponse } from "next";
import { Library } from "../../../../lib/prisma/class/library";
import WantToReadCreator from "../../../../lib/prisma/class/create/want";
import prisma from "../../../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      userId,
      imageLinks,
      industryIdentifiers,
      authors,
      categories,
      ...data
    } = req.body;
    // should there be primary counts?

    const want = new WantToReadCreator(
      data,
      categories,
      authors,
      imageLinks,
      industryIdentifiers,
      userId
    );
    const isLibraryNotInWant = await prisma.book.findFirst({
      where: {
        AND: [
          {
            id: data.id,
            userId: userId,
          },
          {
            NOT: [
              {
                want: { bookId: data.id },
              },
            ],
          },
        ],
      },
      select: { id: true },
    });
    console.log("Reading or Finished?", isLibraryNotInWant);

    try {
      // await updateBook.createOrUpdateToWantToRead();

      if (isLibraryNotInWant) {
        await want.updateWant().then(async () => await want.createWant());
      } else {
        await want.createWant();
      }
      return res.status(201).json({ success: true });
    } catch (err) {
      return res.end(err);
    }
  }
  if (req.method === "DELETE") {
    
  }
  if (req.method === "PATCH") {
    const { id, userId } = req.body;
    const library = new Library(userId, id);
    const libraryId = await library.uniqueIdToString();
    const bookPatcher = new BookPatcher(libraryId);
    try {
      await bookPatcher.removeWantToRead();
      return res.status(204);
    } catch (err) {
      return res
        .status(400)
        .end({ success: false, message: "Unable to modify the primary book" });
    }
  }
}
