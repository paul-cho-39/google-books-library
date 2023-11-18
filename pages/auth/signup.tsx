import React, { useEffect, useState } from 'react';
import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Validate } from '@/lib/resolvers/validation';
import { FormInput } from '@/lib/types/forms';
import ROUTES from '@/utils/routes';

import AuthLayout from '@/components/layout/authLayout';
import { Divider } from '@/components/layout/dividers';
import SignupField from '@/components/inputs/signupForm';
import API_ROUTES from '@/utils/apiRoutes';
import getUsers from '@/models/server/prisma/Users';
import apiRequest from '@/utils/fetchData';
import { signIn } from 'next-auth/react';
import useRedirectIfAuthenticated from '@/lib/hooks/useRedirectAfterAuthenticated';
import metaHeaders from '@/constants/headers';

// this page should be connected to auth/signin
export default function Signup({
               emailAndUsername,
            }: InferGetStaticPropsType<typeof getStaticProps>) {
   const validationSchemaSignUp = Validate(emailAndUsername);
   const formOption = {
      shouldUseNativeValidation: false,
      resolver: yupResolver(validationSchemaSignUp),
   };

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<FormInput>(formOption);

   const [signInError, setError] = useState(false);

   // if the user is already authenticated the page is redirected back
   useRedirectIfAuthenticated();

   // once the user successfully signs in it should reroute to login page
   const onSubmit: SubmitHandler<FormInput> = async (data): Promise<void> => {
      const { username, email, password } = data;
      const body = { username, email, password };

      try {
         const res = await apiRequest<typeof body, { success: boolean }>({
            apiUrl: API_ROUTES.USERS.SIGNUP,
            method: 'POST',
            data: body,
            headers: { 'Content-Type': 'application/json' },
         });

         if (res && res.success) {
            await signIn('credentials', {
               email: email,
               password: password,
               redirect: true,
               callbackUrl: ROUTES.HOME,
            });
         } else {
            setError(true);
            reset(); // reset and try again
         }
      } catch (err) {
         console.error(err);
      }
   };

   return (
      <AuthLayout title={metaHeaders.signup.title} metaTags={metaHeaders.signup.meta()}>
         <div className='flex flex-col'>
            <form
               className='flex-1 flex-col'
               onSubmit={handleSubmit(onSubmit)}
               method='POST'
               action='/signup'
            >
               {/* signup header */}
               <div className='inline-flex mt-10 mb-5 w-full'>
                  <h3 className='font-bold font-primary text-2xl lg:text-4xl text-slate-800 dark:text-slate-200'>
                     Sign Up
                  </h3>
                  {signInError && (
                     <span
                        role='alert'
                        data-testid='signin-field-error'
                        className='text-red-300 text-sm py-1 mb-2'
                     >
                        There seems to be an issue. Please try again
                     </span>
                  )}
               </div>
               <Divider />
               {/* block element for all labels and inputs */}
               <div className='py-5 w-full flex flex-col '>
                  <div role='region'>
                     <SignupField
                        type='text'
                        register={register}
                        label='Username'
                        name='username'
                        error={errors.username}
                     />
                     <SignupField
                        type='email'
                        register={register}
                        label='Email'
                        name='email'
                        error={errors.email}
                     />
                     <SignupField
                        type='password'
                        register={register}
                        label='Password'
                        name='password'
                        error={errors.password}
                     />
                  </div>
                  <div className='mt-7 mb-3 w-full'>
                     <button
                        role='button'
                        type='submit'
                        disabled={errors.email || errors.password || errors.username ? true : false}
                        className='rounded-xl bg-beige dark:bg-charcoal tracking-wider max-w-md w-full h-[40px] border-2 border-orange-200 dark:border-dark-charcoal disabled:opacity-25'
                     >
                        <span className='text-slate-800 dark:text-slate-200'>
                           Create an Account
                        </span>
                     </button>
                  </div>
               </div>
            </form>
            <div className='w-full flex flex-col my-3 justify-center items-center text-slate-800 dark:text-slate-200'>
               <p className='mb-2 font-teritary text-md'>Already have an account?</p>
               <Link href={ROUTES.AUTH.SIGNIN}>
                  <a
                     role='navigation'
                     className='font-teritary text-md hover:underline hover:underline-offset-1 hover:decoration-slate-800 dark:hover:decoration-slate-200'
                  >
                     Sign In
                  </a>
               </Link>
            </div>
         </div>
      </AuthLayout>
   );
}

export async function getStaticProps() {
   const users = await getUsers.findAllUsersEmailAndUsername();

   const emailAndUsername = users.map((user) => {
      return {
         username: user.username,
         email: user.email,
      };
   });

   return { props: { emailAndUsername } };
}
