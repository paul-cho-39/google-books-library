import { FieldError, UseFormRegister } from 'react-hook-form';
import { FormInput } from '../../lib/types/forms';

interface InputFieldProps {
   register: UseFormRegister<FormInput>;
   name: keyof FormInput;
   label: string;
   error: FieldError | undefined;
   type: React.HTMLInputTypeAttribute;
}

const InputField = ({ label, type, name, register, error }: InputFieldProps) => {
   return (
      <div className='mb-2 w-full'>
         <label
            htmlFor={label}
            className='block text-md flex-1 font-medium text-slate-800 dark:text-slate-100'
         >
            {label}*
         </label>
         <input
            id={label}
            aria-label={label}
            className={`${
               error ? 'border-red-400 border-[1px] transition-colors' : ''
            } max-w-md h-10 w-full border-[1px] border-black rounded-md items-center px-2 py-1 placeholder:text-gray-400 transition ease-in-out focus:ring-2 focus:ring-inset focus:ring-orange-400 focus:outline-none`}
            type={type}
            {...register(name)}
         />
         {error && <span className='block text-red-600 mt-0 text-sm'>{error.message}</span>}
      </div>
   );
};

export default InputField;
