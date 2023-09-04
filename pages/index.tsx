import type { InferGetServerSidePropsType, NextPage } from "next";
import { useState } from "react";
import { getSession } from "next-auth/react";
import getUserId from "../lib/helper/getUserId";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "../lib/queryKeys";
import bookApiUpdate from "../lib/helper/books/bookApiUpdate";
import { BookGetter } from "../lib/prisma/class/bookGetter";
import Link from "next/link";
import BookCards from "../components/home/bookCards";
import { ReadingGetter } from "../lib/prisma/class/get/bookgetter";

export type CurrentOrReadingProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

// TODO //
// welcoming sign with username

// POSSIBILITY //
// if the user is reading the page is redirected to timer page
const Home = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data, userId } = props;
  console.log("data from home", data);

  const [dateValue, setDateValue] = useState<Date>(new Date());
  // 1) show which book is the PRIMARY READING BOOK
  // **i) for each row there should be each book row
  // a) if there is no book a link to search for adding books

  // TESTING
  if (!data) {
    return (
      // "track your data here" w/ link to the book page
      <Link
        as={`/profile/${userId}/searchbook`}
        href={`/profile/[id]/searchbook`}
      ></Link>
    );
  }
  // b) if current reading but no primary then cards to choose one
  // c) if primary then show primary

  // 2) show the reading schedule (calendar? / heat map? / best way to visualize?)
  // 3) edit timer? [id]/[bookId]/[date] -> edit here?

  // if there is only one currently Reading book then
  // the primary book is the only currently reading book

  return (
    <>
      <div className="mx-5 text-center font-teritary">Hello React</div>
      <ul role="list">
        {/* start with no data */}
        <h3>Select the main book</h3>
        <BookCards data={data} userId={userId} />
      </ul>
    </>
  );
};

export default Home;

// if this page is not logged in then the main function is to
// attract users to the site
// so in a sense how to promote it properly?

export const getServerSideProps = async (context: any) => {
  const getUser = await getSession(context);
  const userId = getUserId(getUser as object, "id");
  // const bookGetter = new BookGetter(userId);
  // const data = await bookGetter.getCurrentOrPrimary();

  const getter = new ReadingGetter(userId);
  const data = await getter.getEditPrimaryData();
  return {
    props: {
      userId: userId,
      data: data,
    },
  };
};
