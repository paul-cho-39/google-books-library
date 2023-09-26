// refactor by separating the logics of each components separately
import { ErrorMessage } from '@hookform/error-message';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { SignInForm, InputProps, SignInProps } from '../../lib/types/forms';

// TODO // find all relevant name and change the name
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

// change the typescript so that if isDisclosure is true labelname is REQUIRED
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
   const errorsToString = Object.keys(errors).toString();
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
                  {labelName}
               </label>
               <input
                  className={`${
                     isDisclosure
                        ? 'mt-1 px-3 focus:outline-gray-600'
                        : 'my-4 px-1.5 max-w-xsm border-[1px] rounded-md focus:outline-none focus:border-blue-500/40'
                  } ${
                     isSubmitted && errorsToString.includes(name)
                        ? 'border-red-500 border-[1px] shadow-sm'
                        : null
                  }
              text-lg block w-full rounded-md text-blue-gray-900 border-slate-600 shadow-sm h-10 border-[1px] transition-colors duration-200`}
                  type={type}
                  {...register(name)}
                  {...rest}
               />
               {/* REFACTORING one component and wrap it around div tag  */}
               <span
                  className={`${
                     isSubmitted && errorsToString.includes(name)
                        ? 'relatie top-10 text-red-300 rounded-full font-semibold text-left'
                        : 'hidden'
                  }
            `}
               >
                  !
               </span>
               <ErrorMessage
                  errors={errors}
                  name={name}
                  render={({ message }) =>
                     message && (
                        <ErrorNotificationWrapper name={name} errors={errors} message={message} />
                     )
                  }
               />
            </>
         )}
      </>
   );
}

interface ErrorProps {
   key?: React.Key;
   errors?: any;
   message: string;
   name: string;
}

// TODO // have an icon ready
// might change the containerStyle?
function ErrorNotificationWrapper({ key, errors, message, name }: ErrorProps) {
   // eslint-disable-next-line react-hooks/exhaustive-deps
   useEffect(() => {
      toast.error(message, {
         id: name,
         position: 'bottom-center',
      });
      return () => {
         toast.dismiss(message);
      };
   }, [errors, message, name]);
   return (
      <div key={key}>
         <Toaster />
      </div>
   );
}
