import { getProviders } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import { InferGetServerSidePropsType } from 'next';
import { useState, Fragment, useLayoutEffect } from 'react';
import LoginPage from '../../components/Login/providers';
import FormSignIn, { Inputs } from '../../components/Login/credentials';
import { SignInForm } from '../../lib/types/formInputsWithChildren';
// lazy-load? like later in the inputs
import { validateSignUp } from '../../lib/resolvers/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';

interface Providers {
   authProviders: Awaited<ReturnType<typeof getProviders>>;
}

export function Account({ authProviders }: InferGetServerSidePropsType<typeof getServerSideProps>) {
   const { data: session, status } = useSession();
   const [isOpen, setIsOpen] = useState(true);
   const [error, setError] = useState(false);
   const resolver = yupResolver(validateSignUp());
   const router = useRouter();

   const onSubmit = async (data: SignInForm) => {
      const res = await signIn('credentials', {
         email: data.email,
         password: data.password,
         redirect: false,
      });
      // i dont know why but when the button is submitted
      if (!res || status === 'unauthenticated') {
         setError(true);
      }
   };

   const text = status === 'loading' ? 'Logging In' : 'Login';

   // TODO // if the form is submitted have a loader -- what will the loader be?
   // TODO // if session then replace this with dashboard/profile page
   useLayoutEffect(() => {
      if (status === 'authenticated') {
         setIsOpen(false);
         router.push('/');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [session]);

   // there wont be any open modal
   function openModal() {
      setIsOpen(true);
   }

   return (
      <>
         {/* have to wrap the dialog inside transition for transition animation effect */}
         <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='div' static className='h-max max-w-sm' onClose={openModal}>
               <div className='fixed inset-0 h-full overflow-auto '>
                  <div className='flex mx-auto items-center justify-center p-2 text-center'>
                     <Dialog.Panel className='w-full h-full transform rounded-2xl shadow-sm transition-all md:w-[40vw] overflow-hidden'>
                        <div className='border-black bg-white max-w-[100vw] rounded-xl lg:max-h-auto lg:max-w-[60vw]'>
                           <div className='h-max w-max container mx-auto flex flex-col'>
                              <div>
                                 {/* book animation here */}
                                 <div className='my-10'>Logo Here</div>
                                 <h2 className='my-4 text-left text-slate-400 text-lg font-semibold flex-1 md:text-5xl md:static md:text-center md:mb-10'>
                                    Sign In
                                 </h2>
                                 <span className='block mb-5 flex-1 border-b-2 border-y-slate-300/60 w-max-sm self-center md:w-[30vw]'></span>
                                 <p className='mb-3 tracking-tight text-red-500 transition duration-300'>
                                    {error && 'Email or password is invalid'}
                                 </p>

                                 <div>
                                    <FormSignIn resolver={resolver} onSubmit={onSubmit}>
                                       <label className='block text-left font-normal text-primary'>
                                          Email
                                       </label>
                                       <Inputs name='email' />
                                       <div className='w-full flex flex-row justify-between items-stretch '>
                                          <label className='font-normal text-primary'>
                                             Password
                                          </label>
                                          <Link href='/verify/reset/sendverification'>
                                             <span className='self-end underline font-extralight text-primary cursor-pointer'>
                                                Forgot password?
                                             </span>
                                          </Link>
                                       </div>

                                       <Inputs name='password' type='password' />
                                       <button className='rounded-md bg-slate-300/20 tracking-wider max-w-md w-full h-[40px] ring-slate-300/50 hover:opacity-[0.8]'>
                                          {text}
                                       </button>
                                    </FormSignIn>
                                 </div>
                                 <div className='mt-7 flex flex-row justify-evenly items-center'>
                                    <span className='mb-3 border-b-2 border-y-slate-300/60 w-[12vw]'></span>
                                    <span className='relative -top-2 z-40 font-light'>
                                       Or continue with
                                    </span>
                                    <span className='mb-3 border-b-2 border-y-slate-300/60 w-[12vw]'></span>
                                 </div>
                              </div>
                              {authProviders?.map((provider) => (
                                 <LoginPage key={provider?.id} providers={provider} />
                              ))}
                           </div>
                        </div>
                        <div className='my-5'>
                           <p>Not a member?</p>
                           <Link href='/auth/signup'>
                              <a>Sign up</a>
                           </Link>
                        </div>
                     </Dialog.Panel>
                  </div>
               </div>
            </Dialog>
         </Transition>
      </>
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
