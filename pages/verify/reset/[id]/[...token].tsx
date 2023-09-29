import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import FormSignIn, { Inputs } from '../../../../components/Login/credentials';
import { SignInForm } from '../../../../lib/types/forms';
import { validatePassword } from '../../../../lib/resolvers/validation';
import { toast, Toaster } from 'react-hot-toast';
import API_ROUTES from '../../../../utils/apiRoutes';
import apiRequest from '../../../../utils/fetchData';
import ROUTES from '../../../../utils/routes';

export default function ChangePassowrd(props) {
   const [isVerified, setIsVerified] = useState(true);
   const [email, setEmail] = useState('');
   const resolver = yupResolver(validatePassword());

   const router = useRouter();
   const { query } = router;
   const { token, id } = query;
   const userToken = token?.toString();

   const url = API_ROUTES.VERIFY.RESET_EMAIL(id as string, token as string);

   const verify = useCallback(async () => {
      if (!router.isReady) return;

      if (!token || !id) {
         console.error('Either the id or token cannot be identified');
         setIsVerified(false);
         return;
      }

      try {
         const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ userToken, id }),
            headers: { 'Content-Type': 'application/json' },
         });

         if (!res.ok) {
            console.error('Failed to verify:', res.statusText);
            setIsVerified(false);
            return;
         }

         const data = await res.json();
         setEmail(data.email);
      } catch (err) {
         setIsVerified(false);
         console.error(err);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [router.isReady]);

   useEffect(() => {
      verify();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [router.isReady]);

   const onSubmit = async (data: Pick<SignInForm, 'password' | 'confirmPassword'>) => {
      if (!isVerified || !data.password) return;
      if (isVerified) {
         const { password } = data;
         try {
            const res = await apiRequest({
               apiUrl: url,
               method: 'POST',
               delay: 250,
               routeTo: ROUTES.HOME,
               data: password,
            });
         } catch (err) {
            console.error('Failed to change the password with the following error: ', err);
         }
      }
   };

   return (
      <section className='bg-white h-[100vh] w-full'>
         {/* should be passed as a props as a component */}
         {!isVerified ? (
            // TODO // change the styling for this
            <p className='text-4xl font-semibold text-center py-16 overflow-hidden'>
               The token has timed out.{' '}
               <span className='block'>Please resend the token email again</span>
            </p>
         ) : (
            <div className='container mx-auto rounded-md h-[60vh] w-full bg-slate-400/10 my-16 py-14'>
               <div className='flex flex-col items-center justify-center py-5 px-5'>
                  <FormSignIn shouldReset={false} onSubmit={onSubmit} resolver={resolver}>
                     <div className='mb-5'>
                        <h1 className='text-2xl text-center'>Reset your password</h1>
                        {/* define email here */}
                        <p className='text-center'>
                           Request changes for
                           <span className="font-semibold before:content-['_']">{email}</span>
                        </p>
                     </div>
                     {/* requires the name to be changed */}
                     <Inputs
                        name='password'
                        isDisclosure={true}
                        type='password'
                        labelName='Password'
                     />
                     <Inputs
                        name='confirmPassword'
                        isDisclosure={true}
                        type='password'
                        labelName='Confirm password'
                     />
                     <button
                        className='my-3 w-full rounded-md border border-transparent bg-black py-3 px-4 text-sm font-medium text-white shadow-sm hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                        type='submit'
                     >
                        Change Password
                     </button>
                     <Toaster />
                  </FormSignIn>
               </div>
            </div>
         )}
      </section>
   );
}
