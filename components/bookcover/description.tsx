import { useState } from "react";
import {
  removeHtmlTags,
  sliceDescription,
} from "../../lib/helper/books/editBookPageHelper";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";

const BookDescription = ({ description }: { description: string }) => {
  const filteredDescription = removeHtmlTags(description);
  const displayedDescription = sliceDescription(filteredDescription, 200);
  const minimumDescriptionChar = filteredDescription.toString().length;
  const [toggleDescription, setToggleDescription] = useState(false);
  return (
    <>
      {!filteredDescription ? (
        <span className="font-mono">No description provided</span>
      ) : // create another condition where if it does NOT exceed certain length
      !toggleDescription ? (
        <div className="relative mb-5">
          <p className="overflow-hidden line-clamp-3">{displayedDescription}</p>
          <div className="bg-gradient-to-b from-slate-100/5 to-[#ffffff] top-7 w-full absolute h-14"></div>
          <span
            onClick={() => setToggleDescription(true)}
            className={`${
              minimumDescriptionChar < 200
                ? "hidden"
                : "flex items-center justify-center font-semibold mt-2.5 transition-opacity duration-300 hover:cursor-pointer"
            }`}
          >
            See More <ArrowDownIcon height="25" width="20" />{" "}
          </span>
        </div>
      ) : (
        filteredDescription.map((description, index) => (
          <p key={index}>{description}</p>
        ))
      )}
      <span
        onClick={() => setToggleDescription(false)}
        className={`${
          !toggleDescription
            ? "hidden"
            : "flex font-semibold hover:cursor-pointer"
        }  py-2`}
      >
        See Less <ArrowUpIcon height="25" width="20" />{" "}
      </span>
    </>
  );
};

export default BookDescription;
