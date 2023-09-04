import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import sendMail from "../../../lib/helper/sendMail";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const email = req.body;
  if (req.method === "POST") {
    // TODO // added additional params have to migrate update
    const lostUser = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true, email: true },
    });
    if (lostUser) {
      sendMail(lostUser, "15m", "reset");
      res.send({ ok: true, id: lostUser.id });
    }
    if (!lostUser) {
      res.status(400).json({ message: "Mail could not be sent" });
    } else {
      res.status(500).json({ message: "Cannot find the email " });
    }
  }
}
