import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import FormSignIn, { Inputs } from "../../../components/Login/credentials";
import { SignInForm } from "../../../lib/types/formInputsWithChildren";
import fetchApiData, { Method } from "../../../lib/helper/fetchData";

type EmailInput = Pick<SignInForm, "email">;

export default function EmailVerify(props) {
  const [isError, setError] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const message = {
    loading: "loading",
    success: `Message has been sent! Please check your email. You will be redirected to the homepage`,
    error: `The email could not be found. Please try a different email.`,
  };

  const onSubmit = async (data: EmailInput) => {
    const { email } = data;
    if (session || !email || email.length < 5 || !email.includes("@")) return;
    const params = {
      url: "/verify/",
      method: Method["POST"],
      data: email,
    };
    const getEmail = fetchApiData<string>(params);
    toast.promise(getEmail, message, {
      duration: 2500,
      position: "bottom-center",
    });
  };

  return (
    <section className="w-full h-full">
      <div className="container mx-auto">
        <h1 className="mt-3 text-center">Reset your password</h1>
        {/* TODO // customize/style this more */}
        <div className="px-3 flex flex-col justify-center items-center">
          <p className="mt-3 mb-5 overflow-hidden">
            We all forget our password. You can recover it easily just by
            entering your email here!
          </p>
          <FormSignIn shouldReset={true} hidden="hidden" onSubmit={onSubmit}>
            <label className="block text-sm font-semibold text-blue-gray-900 -my-1 -mb-2">
              Email
            </label>
            <Inputs isSubmitted={true} isDisclosure={false} name="email" />
            <button className="my-3 w-full rounded-md border border-transparent bg-black py-3 px-4 text-sm font-medium text-white shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              Send
            </button>
            <Toaster />
          </FormSignIn>
        </div>
      </div>
    </section>
  );
}
