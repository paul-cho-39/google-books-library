import { Resolver, SubmitHandler, UseFormRegister } from 'react-hook-form';

export interface FormInput {
   username: string;
   email: string;
   password: string;
}

export interface SignInForm {
   type: any;
   email?: string;
   password?: string;
   newPassword?: string;
   confirmPassword?: string;
   firstName?: string;
   lastName?: string;
}

export interface InputProps {
   name: keyof SignInForm;
   register?: UseFormRegister<SignInForm | Omit<SignInForm, 'password'>>;
   type?: string;
   labelName?: string;
   displayLabel?: boolean;
   isSubmitted?: boolean;
   errors?: any;
   className?: string;
}

type apiUrlKey = { name: string };

export interface SignInProps<TContext extends object = object> {
   hidden?: 'hidden' | null;
   shouldReset?: boolean;
   children: React.ReactNode;
   defaultValues?: SignInForm | Omit<SignInForm, 'password'>;
   resolver?: Resolver<SignInForm, TContext>;
   onSubmit: SubmitHandler<SignInForm>;
   isDisclosure?: boolean;
}
