import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";
import { SHA256 } from "crypto-js";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // if the user is not in session throw an error?
    const { userId, password, newPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true, id: true },
    });
    const newHashedPassword = SHA256(newPassword).toString();
    const hashedPassword = SHA256(password).toString();
    try {
      if (user?.password === hashedPassword) {
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            password: newHashedPassword,
          },
          select: { id: true, email: true, username: true },
        });
        res.status(200).json(updatedUser);
      } else {
        res.end("Current password is incorrect");
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(400).json({ message: "Try a different request method" });
  }
}
