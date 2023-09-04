import { sign } from "jsonwebtoken";
import cookie from "cookie";
import type { NextApiResponse } from "next";

export type Expiration = "5m" | "15m" | "60m" | "24h";
type User = { id: string };

export const createAccessToken = (user: User, expiresIn: Expiration = "5m") => {
  const secret = process.env.NEXTAUTH_SECRET;
  return (
    secret &&
    sign({ userId: user.id }, secret, {
      expiresIn: expiresIn,
    })
  );
};

export const createRefreshToken = (user: User) => {
  const refreshToken = process.env.REFRESH_TOKEN_SECRET;
  return (
    refreshToken &&
    sign({ userId: user.id }, refreshToken, {
      expiresIn: "30d",
    })
  );
};

// this is not needed? lets test this one out too
export const sendRefreshToken = (res: NextApiResponse, token: string) => {
  res.setHeader(
    "set-cookie",
    cookie.serialize("refreshToken", token, {
      // 30 days for refresh
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    })
  );
};
