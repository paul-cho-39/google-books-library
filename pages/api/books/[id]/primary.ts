import type { NextApiRequest, NextApiResponse } from 'next';
import EditUpdater from '../../../../models/server/prisma/class/edit/editUpdater';
// import { Library } from "../../../../lib/prisma/class/library";
// import { BookGetter } from "../../../../lib/prisma/class/bookGetter";
// import { BookPatcher } from "../../../../lib/prisma/class/bookPatcher";

// requires a patch

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
   if (req.method === 'POST') {
      // make sure that it doesnt add duplicates
      const { id, userId } = req.body;
      const reading = new EditUpdater(id, userId);
      try {
         // see if it throws an error if the primary book being changed is the same?
         // if there are less than two books
         // and the primary book is deleted the next book automatically becomes
         // the primary
         await reading.switchPrimary();
         return res.status(201).json({
            success: true,
         });
      } catch (err) {
         return res.status(404).json({
            error: err,
            message: 'Missing or wrong data input',
         });
      }
   }
}
