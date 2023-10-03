import { getProviders } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import { InferGetServerSidePropsType } from 'next';
import { useState, Fragment, useLayoutEffect } from 'react';
import LoginPage from '../../components/Login/providers';
import FormSignIn, { Inputs } from '../../components/Login/credentials';
import { SignInForm } from '../../lib/types/forms';
// lazy-load? like later in the inputs
import { validateSignUp } from '../../lib/resolvers/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import AuthLayout from '../../components/layout/authLayout';
import { Divider, LabelDivider } from '../../components/layout/dividers';
import ROUTES from '../../utils/routes';

interface Providers {
   authProviders: Awaited<ReturnType<typeof getProviders>>;
}

export function Account({ authProviders }: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const { data: session, status } = useSession();
   const [error, setError] = useState(false);
   const resolver = yupResolver(validateSignUp());

   const router = useRouter();
   const nextPath = (router.query.next as string) || '/';

   const onSubmit = async (data: SignInForm) => {
      const res = await signIn('credentials', {
         email: data.email,
         password: data.password,
         redirect: true,
         callbackUrl: nextPath,
      });

      if (!res || status === 'unauthenticated') {
         console.log('not authenticated');
         setError(true);
      }
   };

   const text = status === 'loading' ? 'Logging In' : 'Login';

   // if user is already signed in and goes to this page
   useLayoutEffect(() => {
      if (status === 'authenticated') {
         router.push(nextPath);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [session]);

   return (
      <AuthLayout>
         <div className='flex flex-col '>
            <div className='flex flex-col'>
               <div>
                  <div className='inline-flex mt-10 mb-4 w-full'>
                     <h3 className='font-bold font-primary text-2xl lg:text-4xl text-slate-800 dark:text-slate-200'>
                        Sign In
                     </h3>
                  </div>
                  <Divider />
                  <p className='mb-3 tracking-tight text-red-500 transition duration-200 dark:text-red-400'>
                     {error && 'Email or password is invalid'}
                  </p>

                  <div>
                     <FormSignIn resolver={resolver} onSubmit={onSubmit}>
                        <label className='block text-md flex-1 text-slate-800 dark:text-slate-100 font-normal text-primary'>
                           Email
                        </label>
                        <Inputs name='email' type='email' />
                        <div className='w-full flex flex-row justify-between items-stretch '>
                           <label className='block text-md flex-1 text-slate-800 dark:text-slate-100 font-normal text-primary'>
                              Password
                           </label>
                           <Link href='/verify/reset/sendverification'>
                              <span className='self-end underline font-extralight text-primary cursor-pointer dark:text-slate-100'>
                                 Forgot password?
                              </span>
                           </Link>
                        </div>

                        <Inputs name='password' type='password' />
                        <button className='rounded-xl shadow-md bg-beige dark:bg-charcoal tracking-wider w-full h-[40px] border-2 border-orange-200 dark:border-dark-charcoal disabled:opacity-25 focus:ring-1 focus:ring-black'>
                           <span className='text-slate-800 dark:text-slate-200'>{text}</span>
                        </button>
                     </FormSignIn>
                  </div>
                  <div className='my-2'>
                     <LabelDivider label='Or continue with' />
                  </div>
               </div>
               {authProviders?.map((provider) => (
                  <LoginPage key={provider?.id} providers={provider} callbackUrl={nextPath} />
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
