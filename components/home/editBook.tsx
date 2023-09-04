import { RadioGroup } from "@headlessui/react";
import { getHighestQualityImage } from "../../lib/helper/books/editBookPageHelper";
import { ImageLinksPairs } from "../../lib/types/googleBookTypes";
import { CurrentOrReadingProps } from "../../pages";
import SingleOrMultipleAuthors from "../bookcards/getEachAuthor";
import Image from "next/image";
import ImageFallback from "../imageFallback";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// change name?
const ShowCurrentBooks: React.FunctionComponent<{
  data: CurrentOrReadingProps["data"];
  //   primaryBooks: CurrentOrReadingProps["data"];
  mutate: () => void;
}> = ({ data, mutate }) => {
  // refactor to another file
  const primaryIndex = data.findIndex((book) => book.primary === true);
  const [selected, setSelected] = useState(data[primaryIndex]);
  const scrollRef = useRef<HTMLElement | null>(null);
  //   const parentRef = useRef<HTMLElement | null>(null);

  // use HOOKs to get this element
  useEffect(() => {
    if (scrollRef && scrollRef.current) {
      scrollRef.current = document.getElementById("primary-book");
      scrollRef.current?.scrollIntoView({
        inline: "center",
        behavior: "smooth",
      });
    }
    // doesnt work for safair?
  }, [selected]);

  // have the height of picture and width = ?

  const totalLength = data.length;
  return (
    // if the book is primary either HIGHLIGHT, STANDOUT, something to show
    //inside the functional component mutate(book.id);

    // overlflow-x-hidden?
    <div className="container w-full px-2 py-7">
      <RadioGroup
        // disabled={true}
        value={selected}
        onChange={setSelected}
        className="overflow-x-auto overflow-y-hidden scrolling-touch mx-auto"
      >
        <RadioGroup.Label className="sr-only">
          List of currently reading book and primary books
        </RadioGroup.Label>
        <div className="mb-2 h-80 flex flex-row mx-auto -space-x-9">
          {data &&
            data.map((book, index) => (
              <RadioGroup.Option
                key={book.id}
                role="contentinfo"
                value={book}
                className={({ active, checked }) =>
                  `${
                    active
                      ? "-translate-y-3 duration-200 ease-linear"
                      : "scale-90"
                  }
            ${
              checked && index === totalLength - 1
                ? "mt-6 py-6 pr-0 pl-1 -translate-y-1 z-30 transition-all duration-200 ease-linear"
                : checked && index < totalLength - 1
                ? "mx-3 px-5 mt-6 py-6 -translate-y-2 z-30 transition-all duration-200 ease-linear"
                : "bg-white opacity-[0.38] transition-color duration-200 ease-linear scale-90"
            }
             cursor-pointer rounded-xl not-first:px-5 first:pl-1 first:pr-0 focus:outline-none w-full`
                }
              >
                {/* TO DISPLAY PRIMARY: ABSOLUTE AND SHOW PRIMARY BOOK */}
                {({ active, checked }) => (
                  <div className="w-full">
                    <RadioGroup.Label
                      as="div"
                      className={`flex flex-row items-center ${
                        checked
                          ? "text-slate-500 font-medium text-sm "
                          : "invisible"
                      }`}
                    >
                      {/* and have this in a separate component? */}
                      {/* if not disabled then have this as a button? green */}
                      <h3 className="font-medium text-md pb-5 text-center">
                        Currently Recording
                      </h3>
                    </RadioGroup.Label>
                    <RadioGroup.Label as="div">
                      {/* image */}
                      <div
                        id={active ? "primary-book" : ""}
                        className={`bg-white w-[6.2rem] rounded-lg pb-2
                        ${
                          checked
                            ? "scale-x-[125%] scale-y-[110%]"
                            : "scale-110"
                        } `}
                        onClick={mutate}
                      >
                        <Image
                          // think of getting the highest quality image
                          src={book?.imageLinks?.thumbnail}
                          //   src={getHighestQualityImage(book.imageLinks)}
                          alt={`${book.title} book cover image`}
                          priority
                          //   layout="fill"
                          className=""
                          objectFit="inherit"
                          width={125}
                          height={215}
                        />
                      </div>
                    </RadioGroup.Label>
                    <RadioGroup.Description as="div">
                      {/* placed at the bottom */}
                      <div className="flex itmes-center ">
                        <h3
                          className={`md:text-left md:-ml-3 line-clamp-2 tracking-tight leading-snug w-full font-serif font-medium text-center  ${
                            checked ? "mt-1" : "invisible"
                          }`}
                        >
                          {book.title}
                        </h3>
                        {/* dont need author i suppose? */}
                        {/* <SingleOrMultipleAuthors authors={book.authors} /> */}
                      </div>
                    </RadioGroup.Description>
                  </div>
                )}
              </RadioGroup.Option>
            ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default ShowCurrentBooks;
