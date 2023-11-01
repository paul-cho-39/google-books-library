// refactor by separating the logics of each components separately
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { SignInForm, InputProps, SignInProps } from '@/lib/types/forms';
import classNames from 'classnames';
import { capitalizeWords } from '@/lib/helper/transformChar';

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
         reset({ type: 'password', password: '' }, { keepErrors: true });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isSubmitSuccessful, isSubmitted]);

   const enhancedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.props.name) {
         return React.cloneElement(
            child,
            // the spread syntax is to shut the typescript error
            {
               ...{
                  ...child.props,
                  register,
                  errors,
                  isSubmitted,
               },
            }
         );
      }
      return child;
   });

   return (
      <>
         <form
            className={`${isDisclosure ? 'mt-6 space-y-2' : null}`}
            onSubmit={handleSubmit(onSubmit)}
         >
            {enhancedChildren}
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
   displayLabel = false,
   className,
   ...rest
}: InputProps) {
   const hasError = errors[name];
   const classname = !className
      ? 'block text-sm font-semibold text-blue-gray-900 -my-1'
      : className;
   return (
      <>
         {register && (
            <>
               {displayLabel && (
                  <label htmlFor={labelName} className={classname}>
                     {labelName && capitalizeWords(labelName)}
                  </label>
               )}
               <input
                  id={labelName}
                  className={`${
                     displayLabel
                        ? 'mt-1 px-3 focus:outline-gray-600'
                        : 'my-2 px-1.5 max-w-xsm border-[1px] rounded-md focus:outline-none focus:border-blue-500/40'
                  } ${isSubmitted && hasError ? 'ring-2 ring-red-500 shadow-md' : null}
              text-lg block p-2 w-full rounded-md text-blue-gray-900 border-slate-600 shadow-sm h-10 border-[1px] transition-colors duration-200`}
                  type={type}
                  {...register(name)}
                  {...rest}
               />
               {hasError && (
                  <span role='alert' className='text-red-500 -mt-4 mb-1'>
                     {capitalizeWords(name)} is incorrect
                  </span>
               )}
            </>
         )}
      </>
   );
}
