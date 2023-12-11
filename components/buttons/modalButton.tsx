import { signOut } from 'next-auth/react';
import apiRequest from '@/utils/fetchData';
import { ApiRequestOptions, Method } from '@/lib/types/fetchbody';
import API_ROUTES from '@/utils/apiRoutes';

interface ModalButtonProps {
   id: string;
   shouldSignOut: boolean;
}
// should this be a component or a hook? function makes sense too?
export const ModalInnerButton = ({ id, shouldSignOut = false }: ModalButtonProps) => {
   const params: ApiRequestOptions<string> = {
      apiUrl: API_ROUTES.USERS.DELETE,
      method: 'DELETE',
      data: id,
      shouldRoute: false,
      delay: 250,
   };
   //   should have shouldSignout Logic here or elsewhere?
   const onSubmit = async () => {
      apiRequest(params).then(() => (shouldSignOut ? signOut({ callbackUrl: '/' }) : null));
   };
   return (
      <button className='text-red-600 text-lg p-2 my-2 lg:my-4' onClick={onSubmit}>
         Delete Account
      </button>
   );
};
