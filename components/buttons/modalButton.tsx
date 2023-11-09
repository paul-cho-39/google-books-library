import { signOut } from 'next-auth/react';
import apiRequest from '@/utils/fetchData';
import { ApiRequestOptions, Method } from '@/lib/types/fetchbody';

interface ModalButtonProps {
   name: string;
   id: string;
   url: string;
   method: Method;
   shouldSignOut: boolean;
}
// should this be a component or a hook? function makes sense too?
export const ModalInnerButton = ({
   name,
   id,
   url,
   method,
   shouldSignOut = false,
}: ModalButtonProps) => {
   const params: ApiRequestOptions<string> = {
      apiUrl: url,
      method: method,
      data: id,
      shouldRoute: false,
      delay: 250,
   };
   //   should have shouldSignout Logic here or elsewhere?
   const onSubmit = async () => {
      apiRequest(params).then(() => (shouldSignOut ? signOut({ callbackUrl: '/' }) : null));
   };
   return <button onClick={onSubmit}>{name}</button>;
};
