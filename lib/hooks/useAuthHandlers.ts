import API_ROUTES from '@/utils/apiRoutes';
import ROUTES from '@/utils/routes';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import getUserInfo from '../helper/getUserId';

/**
 * @description This is not recommended practice for deleting the session when user signs out.
 * The function is designed for brevity to delete sessionToken when Credential user signs out.
 */
const useAuthHandlers = () => {
   const [isLoading, setIsLoading] = useState(false);

   const router = useRouter();

   const handleSignOut = async (isCredential: boolean) => {
      if (isCredential) {
         try {
            const res = await fetch(API_ROUTES.AUTH.SIGNOUT, {
               method: 'POST',
            });

            setIsLoading(true);

            if (res.ok) {
               await signOut({ redirect: true });

               setIsLoading(false);
               router.push(ROUTES.HOME);
            }
         } catch (err) {
            console.error('Failed to sign out the credential user.', err);
         }
      } else {
         signOut({ redirect: true });

         setIsLoading(true);

         setTimeout(() => {
            setIsLoading(false);
            router.push(ROUTES.HOME);
         }, 200);
      }
   };

   // the logic here should be changed?
   const linkToSettings = (userId: string | null) => {
      if (!userId) return;

      router.push(ROUTES.PROFILE.SETTINGS(userId));
   };

   return {
      isLoading,
      handleSignOut,
      linkToSettings,
   };
};

export default useAuthHandlers;
