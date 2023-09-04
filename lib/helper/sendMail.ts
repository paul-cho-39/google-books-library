import sendRecoveryMail from "../auth/email/recoverymail";
import { createAccessToken, Expiration } from "../auth/token";

export default function sendMail(
  user: { id: string; email?: string | null },
  expires: Expiration,
  urlPath: "reset" | "verify"
) {
  if (user && user.email) {
    const token = createAccessToken(user, expires);
    let path = "/verify";
    urlPath === "reset" && (path = path + "/reset");
    urlPath === "verify" && (path = path + "/verify-email");
    const link = process.env.NEXTAUTH_URL + path + `/${user.id}` + `/${token}`;
    sendRecoveryMail(user.email, link, link);
  }
}
