import { signOut } from "next-auth/react";
import fetchApiData, { Method } from "../../lib/helper/fetchData";

interface ButtonProps {
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
}: ButtonProps) => {
  const options = {
    shouldRoute: false,
    delay: 1000,
  };
  const params = {
    url: url,
    method: method,
    data: id,
    options,
  };
  //   should have shouldSignout Logic here or elsewhere?
  const onSubmit = async () => {
    fetchApiData(params).then(() =>
      shouldSignOut ? signOut({ callbackUrl: "/" }) : null
    );
  };
  return <button onClick={onSubmit}>{name}</button>;
};
