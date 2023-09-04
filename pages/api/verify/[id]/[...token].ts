import type { NextApiRequest, NextApiResponse } from "next";
import { verify } from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import { SHA256 } from "crypto-js";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userToken, id } = req.body;
  if (req.method === "POST") {
    const payload = verify(userToken, process.env.NEXTAUTH_SECRET as string);
    console.log(payload);
    if (!payload) {
      return res
        .status(400)
        .json({ message: "The token is invalid or expired" });
    }
    if (payload) {
      const user = await prisma.user.findUnique({
        where: { id: id },
        select: { email: true },
      });
      res.send({ ok: true, email: user?.email });
    }
  }

  if (req.method === "PUT") {
    try {
      const password = req.body;
      const hashedPassword = SHA256(password).toString();
      const user = await prisma.user.update({
        where: { id: id },
        data: { password: hashedPassword },
      });
      user && res.status(200).json(user);
    } catch (e) {
      console.error(e);
    }
  } else {
    res.end("Failed to update the password");
  }
}
