import { useState } from "react";
import router, { useRouter } from "next/router";
import { ClientSafeProvider, signIn } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

type Mail = {
  mail: ClientSafeProvider | undefined;
};
const EmailProvider = ({ mail }: Mail) => {
  const [email, setEmail] = useState("");

  //   it returns a promise so can this be used for handling errors?
  //   const handleSignIn = async () => {
  //     const { ok, error } = await signIn(mail, {
  //       redirect: false,
  //       callbackUrl: "http://localhost:3000/",
  //     });
  //   };

  return (
    <div className="flex flex-col items-center">
      <label>
        <input
          autoFocus
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          className="border-black border-2 px-1 h-11 min-w-[250px] rounded-md shadow-sm focus:outline-none focus:shadow-md md:min-w-[310px]"
        />
      </label>
      <button
        onClick={() =>
          signIn("email", {
            email,
            callbackUrl: "http://localhost:3000/",
          })
        }
        className="mt-3 mb-8 bg-slate-200/30 border-black w-[250px] h-9 tracking-wider border rounded-lg ring-3 shadow-sm focus:outline-none focus:shadow-md lg:mb-10"
      >
        Continue with email
      </button>
    </div>
  );
};

export default EmailProvider;

// note that when redirect is false it returns a promise of: {
//     error: string | undefined // Error code based on the type of error
//     status: number // HTTP status code
//     ok: boolean // `true` if the signin was successful
//     url: string | null // `null` if there was an error, otherwise URL to redirected to
// }
