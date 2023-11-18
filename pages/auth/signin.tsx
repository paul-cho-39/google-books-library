import { useState, Fragment, useLayoutEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { getProviders } from 'next-auth/react';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';

import { SignInForm } from '@/lib/types/forms';
import { validateSignUp } from '@/lib/resolvers/validation';
import ROUTES from '@/utils/routes';

import AuthLayout from '@/components/layout/authLayout';
import FormSignIn, { Inputs } from '@/components/Login/credentials';
import { Divider, LabelDivider } from '@/components/layout/dividers';
import useRedirectIfAuthenticated from '@/lib/hooks/useRedirectAfterAuthenticated';
import AuthProviders from '@/components/Login/providers';
import metaHeaders from '@/constants/headers';

export function Account({ authProviders }: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const [error, setError] = useState(false);
   const resolver = yupResolver(validateSignUp());

   const router = useRouter();
   const nextPath = (router.query.next as string) || '/';

   const onSubmit = async (data: SignInForm) => {
      const res = await signIn('credentials', {
         email: data.email,
         password: data.password,
         redirect: false,
         // callbackUrl: nextPath,
      });

      if (res?.ok) {
         router.push(nextPath);
      } else {
         setError(true);
      }
   };

   useRedirectIfAuthenticated();

   return (
      <AuthLayout title={metaHeaders.signin.title} metaTags={metaHeaders.signin.meta()}>
         <div className='flex flex-col '>
            <div className='flex flex-col'>
               <div role='main'>
                  <div className='inline-flex mt-10 mb-4 w-full'>
                     <h3 className='font-bold font-primary text-2xl lg:text-4xl text-slate-800 dark:text-slate-200'>
                        Sign In
                     </h3>
                  </div>
                  <Divider />
                  <p
                     role='alert'
                     className='mb-3 tracking-tight text-red-500 transition duration-200 dark:text-red-400'
                  >
                     {error && 'Email or password is invalid'}
                  </p>

                  <div>
                     <FormSignIn resolver={resolver} onSubmit={onSubmit}>
                        <Inputs
                           name='email'
                           type='email'
                           labelName='email'
                           displayLabel={true}
                           className='block text-md flex-1 text-slate-800 dark:text-slate-100 font-normal text-primary'
                        />
                        <div className='w-full flex flex-row justify-end'>
                           <Link href='/verify/reset/sendverification'>
                              <span className='self-end underline font-extralight text-primary cursor-pointer dark:text-slate-100'>
                                 Forgot password?
                              </span>
                           </Link>
                        </div>

                        <Inputs
                           name='password'
                           type='password'
                           labelName='password'
                           displayLabel={true}
                           className='block text-md flex-1 text-slate-800 dark:text-slate-100 font-normal text-primary'
                        />
                        <button
                           data-testid='signin-button'
                           className='my-2 rounded-xl shadow-md bg-beige dark:bg-charcoal tracking-wider w-full h-[40px] border-2 border-orange-200 dark:border-dark-charcoal disabled:opacity-25 focus:ring-1 focus:ring-black'
                        >
                           <span className='text-slate-800 dark:text-slate-200'>Login</span>
                        </button>
                     </FormSignIn>
                  </div>
                  <div className='my-2'>
                     <LabelDivider label='Or continue with' />
                  </div>
               </div>
               {authProviders?.map((provider) => (
                  <AuthProviders key={provider?.id} providers={provider} callbackUrl={nextPath} />
               ))}
            </div>
            <div className='flex flex-col justify-center items-center'>
               <p className='text-slate-800 dark:text-slate-100'>Not a member?</p>
               <Link href={ROUTES.AUTH.SIGNUP}>
                  <a className='text-slate-800 dark:text-slate-100 hover:underline hover:underline-offset-1 hover:decoration-slate-800 dark:hover:decoration-slate-200'>
                     Sign up
                  </a>
               </Link>
            </div>
         </div>
      </AuthLayout>
   );
}

export async function getServerSideProps() {
   const providers = await getProviders();
   return {
      props: {
         authProviders: [providers?.google, providers?.facebook],
      },
   };
}

export default Account;
