import { useMemo } from "react";
import { isBookInData } from "../../lib/helper/books/isBooksInLibrary";
import { CheckBadgeIcon, CheckIcon } from "@heroicons/react/20/solid";
import React from "react";

const FilterStatus = ({
  bookId,
  finishedData,
  currentlyReading,
  wantToRead,
}: {
  bookId: string;
  finishedData: string[] | undefined;
  currentlyReading: string[] | undefined;
  wantToRead: string[] | undefined;
}) => {
  const readingStatus = useMemo(
    () =>
      // may be better to use switch but at the same time only want
      // one status in this order??
      isBookInData(bookId, finishedData) ? (
        <>
          <CheckBadgeIcon height="20" width="20" fill="green" stroke="green" />
          <span>Finished reading</span>
        </>
      ) : isBookInData(bookId, currentlyReading) ? (
        <>
          <CheckIcon height="20" width="20" stroke="green" />
          <span>Currently reading</span>
        </>
      ) : isBookInData(bookId, wantToRead) ? (
        <>
          <CheckIcon height="20" width="20" stroke="white" />
          <span>Currently reading</span>
        </>
      ) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [finishedData, currentlyReading, wantToRead]
  );

  return <div className="inline-flex flex-row">{readingStatus}</div>;
};

export default FilterStatus;
