import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
// can use Controller to streamline and use it along with another UI library/components

interface FormInput {
   username: string;
   email: string;
   password: string;
}

const SignupPage = () => {
   const [isDisabled, setIsDisabled] = useState(false);
   const [isTimer, setIsTimer] = useState(false);
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormInput>({
      shouldUseNativeValidation: false,
   });

   const onSubmit: SubmitHandler<FormInput> = (data) => {
      // write the conditions here to fetch
      // only works when the whole form is successfully outputted
      if (errors.username && !isTimer) {
         setIsTimer(false);
      }
      console.log(data);
   };

   // if success the page should go back to its original page
   //   the next step is writing a condition for username: get prisma
   //   other error boundaries like making sure its an email will be validated
   // using react-hook-forms
   useEffect(() => {
      // if error message should disappear then set the timer
      const timerId2 = setTimeout(() => {
         errors.username && isTimer && setIsTimer((prev) => !prev);
      }, 500);

      return () => {
         clearTimeout(timerId2);
      };
   }, [isTimer]);

   useEffect(() => {
      const timerId = setTimeout(() => {
         errors.username && !isTimer && setIsTimer(true);
      }, 500);

      return () => {
         clearTimeout(timerId);
      };
   }, [errors.username]);

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <div className='flex flex-col justify-center items-center'>
            <label>Username * </label>
            <input {...register('username', { required: true, maxLength: 30 })} />
            <span className='text-red-500 transition-transform ease-in duration-300'>
               {errors.username && isTimer && ' Username is Required'}
            </span>
            <label>Email *</label>
            <input type='email' {...register('email', { required: true })} />
            <label>Password *</label>
            <input type='password' {...register('password', { required: true, minLength: 6 })} />
            <button className='my-3 w-[150px] border-2 border-slate-400' type='submit'>
               Submit
            </button>
         </div>
      </form>
   );
};

export default SignupPage;

// use validate function to validate prisma users OR
// is it manually inputting errors and clearing errors

// so it is passed as an object
// watch can be useful if it needed to return a "value" and do something with it
// the value can be object (data), string, number, array
// register is a function
