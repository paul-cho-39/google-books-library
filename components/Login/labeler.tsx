import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form/dist/types';

interface Inputs {
   labeler: string;
   formRegister: (name: string, options?: Object | undefined) => UseFormRegisterReturn<string>;
}

// customize it after
const FormInput = ({ labeler, formRegister }: Inputs) => {
   return (
      <div className='my-5'>
         <label className='capitalize pr-4'>{labeler}: </label>
         <input className='border-2 border-black px-2 rounded-sm' {...formRegister} />
      </div>
   );
};

export default FormInput;
