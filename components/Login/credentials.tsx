// refactor by separating the logics of each components separately
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { SignInForm, InputProps, SignInProps } from '@/lib/types/forms';
import classNames from 'classnames';

export default function FormSignIn<TFieldValues extends FieldValues>({
   hidden,
   children,
   defaultValues,
   resolver,
   onSubmit,
   shouldReset = true,
   isDisclosure = false,
}: SignInProps<TFieldValues>) {
   const {
      register,
      handleSubmit,
      reset,
      clearErrors,
      formState: { errors, isSubmitSuccessful, isSubmitted },
   } = useForm<SignInForm>({
      resolver: resolver,
      reValidateMode: 'onSubmit',
      defaultValues,
   });

   // form hooks are wholly reset after successfully submitting
   useEffect(() => {
      isSubmitted && clearErrors();
      if (shouldReset && isSubmitSuccessful) {
         reset();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isSubmitSuccessful, isSubmitted]);

   return (
      <>
         <form
            className={`${isDisclosure ? 'mt-6 space-y-2' : null}`}
            onSubmit={handleSubmit(onSubmit)}
         >
            {Array.isArray(children)
               ? children.map((child) => {
                    // if child props contain name pass all props to children
                    return child.props.name
                       ? React.createElement(child.type, {
                            ...{
                               ...child.props,
                               register,
                               isSubmitted,
                               errors,
                               key: child.props.name,
                            },
                         })
                       : child;
                 })
               : children}
         </form>
      </>
   );
}

export function Inputs({
   register,
   errors,
   type,
   name,
   labelName,
   isSubmitted,
   isDisclosure = false,
   ...rest
}: InputProps) {
   const errorsToString = Object.keys(errors).toString().toLocaleLowerCase();
   const containsError = (name: keyof SignInForm) => {
      return errorsToString.includes(name.toLocaleLowerCase());
   };
   return (
      <>
         {register && (
            <>
               {/* REFACTORING another component */}
               <label
                  htmlFor={labelName}
                  className={`${
                     isDisclosure
                        ? 'block text-sm font-semibold text-blue-gray-900 -my-1'
                        : 'hidden'
                  } my-1.5`}
               >
                  {labelName}{' '}
               </label>
               <input
                  className={`${
                     isDisclosure
                        ? 'mt-1 px-3 focus:outline-gray-600'
                        : 'my-2 px-1.5 max-w-xsm border-[1px] rounded-md focus:outline-none focus:border-blue-500/40'
                  } ${isSubmitted && containsError(name) ? 'ring-2 ring-red-500 shadow-md' : null}
              text-lg block p-2 w-full rounded-md text-blue-gray-900 border-slate-600 shadow-sm h-10 border-[1px] transition-colors duration-200`}
                  type={type}
                  {...register(name)}
                  {...rest}
               />
               <span
                  className={classNames(containsError(name) ? 'text-red-500 -mt-4 mb-1' : 'hidden')}
               >
                  {containsError(name) && 'One or more input is incorrect'}
               </span>
            </>
         )}
      </>
   );
}
