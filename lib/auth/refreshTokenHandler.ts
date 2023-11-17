/* eslint-disable react-hooks/exhaustive-deps */
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect } from "react";

const RefreshTokenHandler = (props: { setInterval: (val: number) => void }) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!!session) {
      const timeRemaining = Math.round(
        // the time has to be changed this is set to 23hr 30mins
        ((session.expires as unknown as number) - 30 * 60 * 1000 - Date.now()) /
          1000
      );
      props.setInterval(timeRemaining > 0 ? timeRemaining : 0);
    }
  }, [session]);

  return null;
};

export default RefreshTokenHandler;
