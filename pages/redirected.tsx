import { atom, useAtom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";
import GeoLocation from "../components/location";

const textAtom = atomWithStorage("text", "hello");

export default function Redirected(props) {
  const [text, setText] = useAtom(textAtom);
  console.log(text);
  console.log(textAtom);
  return (
    <>
      Not working?
      <GeoLocation />
    </>
  );
}
