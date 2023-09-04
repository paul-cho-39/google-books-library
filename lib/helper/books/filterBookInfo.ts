import { Items } from "../../types/googleBookTypes";

const filterKeys = [
  "authors",
  "categories",
  "description",
  "imageLinks",
  "industryIdentifiers",
  "language",
  "pageCount",
  "publishedDate",
  "publisher",
  "subtitle",
  "title",
];

function filterBookInfo<T extends Items<any>>(data: T) {
  const volumeInfo = data?.volumeInfo;
  return Object.fromEntries(
    Object.entries(volumeInfo).filter(([key]) => filterKeys.includes(key))
  );
}

export default filterBookInfo;
