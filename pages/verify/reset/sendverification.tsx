import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import FormSignIn, { Inputs } from '@/components/Login/credentials';
import { SignInForm } from '@/lib/types/forms';
import { ApiRequestOptions } from '@/lib/types/fetchbody';
import API_ROUTES from '@/utils/apiRoutes';
import apiRequest from '@/utils/fetchData';

type EmailInput = Pick<SignInForm, 'email'>;

export default function EmailVerify({}) {
   const [isError, setError] = useState(false);
   const { data: session } = useSession();
   const router = useRouter();

   const message = {
      loading: 'loading',
      success: `Message has been sent! Please check your email. You will be redirected to the homepage`,
      error: `The email could not be found. Please try a different email.`,
   };

   const onSubmit = async (data: EmailInput) => {
      const { email } = data;
      if (session || !email || email.length < 5 || !email.includes('@')) return;

      const params: ApiRequestOptions<string> = {
         apiUrl: API_ROUTES.VERIFY.SEND_VERIFICATION,
         method: 'POST',
         data: email,
      };

      await apiRequest(params);

      toast.promise(apiRequest(params), message, {
         duration: 250,
         position: 'bottom-center',
      });
   };

   return (
      <section className='w-full h-full'>
         <div className='container mx-auto'>
            <h1 className='mt-3 text-center'>Reset your password</h1>
            {/* TODO // customize/style this more */}
            <div className='px-3 flex flex-col justify-center items-center'>
               <p className='mt-3 mb-5 overflow-hidden'>
                  We all forget our password. You can recover it easily just by entering your email
                  here!
               </p>
               <FormSignIn shouldReset={true} hidden='hidden' onSubmit={onSubmit}>
                  <label
                     htmlFor='email'
                     className='block text-sm font-semibold text-blue-gray-900 -my-1 -mb-2'
                  >
                     Email
                  </label>
                  <Inputs isSubmitted={true} name='email' displayLabel />
                  <button className='my-3 w-full rounded-md border border-transparent bg-black py-3 px-4 text-sm font-medium text-white shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'>
                     Send
                  </button>
                  <Toaster />
               </FormSignIn>
            </div>
         </div>
      </section>
   );
}
