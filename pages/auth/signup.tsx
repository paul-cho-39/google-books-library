import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import prisma from '../../lib/prisma';
import { useForm, SubmitHandler } from 'react-hook-form';
import { InferGetStaticPropsType } from 'next';
import SignupPage from '../../components/Login/signup';
// this should be lazy-loaded?
import { Validate } from '../../lib/resolvers/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthLayout from '../../components/layout/authLayout';
import { Divider } from '../../components/layout/dividers';
import { FormInput } from '../../lib/types/forms';
import InputField from '../../components/inputs/inputfield';

// this page should be connected to auth/signin
export default function Signup({
   username,
   email,
}: InferGetStaticPropsType<typeof getStaticProps>) {
   const validationSchemaSignUp = Validate(username, email);
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

   // TODO //
   // also have to include "GET" resolvers for ALL emails and verify there
   const onSubmit: SubmitHandler<FormInput> = async (data): Promise<void> => {
      const { username, email, password } = data;
      const body = { username, email, password };
      try {
         await fetch('/api/user/signup', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
         }).then((res) => res.status === 201 && reset());
      } catch (e) {
         console.error(e);
      }
   };

   return (
      <AuthLayout>
         <div className='flex flex-col  '>
            <form
               className='flex-1 flex-col'
               onSubmit={handleSubmit(onSubmit)}
               id='signup'
               method='POST'
               action='/signup'
            >
               {/* signup header */}
               <div className='inline-flex mt-10 mb-5 w-full'>
                  <h3 className='font-bold font-primary text-2xl lg:text-4xl text-slate-800 dark:text-slate-200'>
                     Sign Up
                  </h3>
               </div>
               <Divider />
               {/* block element for all labels and inputs */}
               <div className='py-5 w-full flex flex-col '>
                  <div role='form'>
                     <InputField
                        type='text'
                        register={register}
                        label='Username'
                        name='username'
                        error={errors.username}
                     />
                     <InputField
                        type='email'
                        register={register}
                        label='Email'
                        name='email'
                        error={errors.email}
                     />
                     <InputField
                        type='password'
                        register={register}
                        label='Password'
                        name='password'
                        error={errors.password}
                     />
                  </div>
                  <div className='mt-7 mb-3 w-full'>
                     <button
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
               <Link href='/auth/signin'>
                  <a className='font-teritary text-md hover:underline hover:underline-offset-1 hover:decoration-slate-800 dark:hover:decoration-slate-200'>
                     Sign In
                  </a>
               </Link>
            </div>
         </div>
      </AuthLayout>
   );
}

export async function getStaticProps() {
   const allUsers = await prisma.user.findMany({
      select: {
         email: true,
         username: true,
      },
   });
   return {
      props: {
         username: JSON.parse(JSON.stringify(allUsers)).map((user: User) => user.username),
         email: JSON.parse(JSON.stringify(allUsers)).map((user: User) => user.email),
      },
   };
}

type User = {
   email?: string;
   username?: string;
};

// it might be a better idea to pass props from signup
{
   /* <div className='mb-5 max-h-[85px] w-full'>
                        <label className='block text-md flex-1 font-semibold'>Username*</label>
                        <input
                           // if error the border should be red
                           className={`${
                              errors.username
                                 ? 'border-red-400 border-[1px] transition-colors'
                                 : null
                           }
                    max-w-sm w-full border-[1px] border-black rounded-md items-center px-2 py-1 transition ease-in-out focus:border-blue-300/50 focus:outline-none`}
                           type='text'
                           {...register('username')}
                        />
                        <span className='block text-red-600 mt-0 text-sm'>
                           {errors.username && `${errors.username.message}`}
                        </span>
                     </div>
                     <div className='mb-5 max-h-[85px] w-full'>
                        <label className='block mb-4 text-md flex-1 tracking-wider font-semibold'>
                           Email*
                        </label>
                        <input
                           className={`${
                              errors.email
                                 ? 'border-red-400 border-[1px] transition-colors focus:border-red-400'
                                 : null
                           }
                    max-w-sm w-full border-[1px] border-black rounded-md items-center px-2 py-1 transition ease-in-out focus:border-blue-300/50 focus:outline-none`}
                           type='email'
                           {...register('email')}
                        />
                        <span className='block text-red-600 mt-0 text-sm'>
                           {errors.email && `${errors.email.message}`}
                        </span>
                     </div>
                     <div className='mb-5 max-h-[85px] w-full'>
                        <label className='block flex-nowrap mb-4 text-md flex-1 font-semibold'>
                           Password*
                        </label>
                        <input
                           className={`${
                              errors.password
                                 ? 'border-red-400 border-[1px] transition-colors focus:border-red-400'
                                 : null
                           }
                    max-w-sm w-full border-[1px] border-black rounded-md items-center px-2 py-1 transition ease-in-out focus:border-blue-300/50 focus:outline-none`}
                           type='password'
                           {...register('password')}
                        />
                        {/* the error message should show onBlur */
}
//       <span className='block text-red-600 mt-0 text-sm'>
//          {errors.password && `${errors.password.message}`}
//       </span>
//    </div>
// </div>
// <div className='mt-7 mb-3 w-full'>
//    <button
//       disabled={errors.email || errors.password || errors.username ? true : false}
//       className='rounded-lg bg-slate-300/20 tracking-wider max-w-sm w-full h-[40px] ring-1 disabled:opacity-25'
//    >
//       Create an Account
//    </button>
// </div> */}
