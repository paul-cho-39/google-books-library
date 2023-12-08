import { InferGetServerSidePropsType } from "next";

// book timer for timing the book
// Question:
// whenever the PRIMARY BOOK is switched from one to another
// can it be switched with ease? is it possible to do this?

export const getServerSideProps = async (context: any) => {
  const { id: userId } = context.query;

  // GET the MAIN BOOK CURRENTLY READING
  return {
    props: {
      userId: userId,
    },
  };
};
// TWO THINGS TO BE WARY OF**
// if not userId then modal popup for signing in
// if mainbook is not issued by the user then modal popup of "currently reading"

export const BookTimer = () => {
  // 1) how to automatically start whenever this page is opened?
  // 2) and also close whenever it is opened again WHEN the timer is on
  // whenever x.start - x.newStart < x.start
  // 3) maxTime = 6 hrs?
  // 4) put the timer inside localStorage at its INITIAL TIME
  // 5) then when the time ENDS the localStorage is cleared
  // 6) default time is 3 hrs (unless the timer stops) and can be edited

  return (
    // create a timer here
    // timer will have START, STOP, RESET, END BUTTON
    // should there be a timer where counting down?
    // that means adding some sound?
    <div></div>
  );
};
