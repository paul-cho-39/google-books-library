// should have multiple google api keys so when handled multiple requests it successfully
// goes without lag?

import { string } from "yup/lib/locale";

// maybe make this into a class?
export const getCompleteUrl = (
  search: string,
  maxResultNumber: number = 15,
  pageIndex: number = 0
): string => {
  const url = "https://www.googleapis.com/books/v1/volumes?q=";
  const index = `&startIndex=${pageIndex}`;
  const maxResult = `&maxResults=${maxResultNumber}`;
  const rest = `&orderBy=relevance&printType=books&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`;

  return url + search + index + maxResult + rest;
};

export const getAuthorUrl = (author: string) => {
  const url = "https://www.googleapis.com/books/v1/volumes?q=";
  const authorUrl = `+inauthor:${author}`;
  const rest = `&orderBy=relevance&printType=books&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`;

  return url + authorUrl + rest;
};

// add key but a different one?
export const getGoogleByIsbn = (isbn: string, maxResultNumber: number = 20) => {
  const url = "https://www.googleapis.com/books/v1/volumes?q=";
  const getIsbn = `isbn:${isbn}`;
  const maxResult = `&maxResults=${maxResultNumber}`;

  return url + getIsbn + maxResult;
};

// add key but a different one?
export const getDataByVolumeId = (id: string) => {
  const url = "https://www.googleapis.com/books/v1/volumes/";
  const keys = `&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`;
  return url + id;
};

const fetcher = async (input: RequestInfo, init?: RequestInit) => {
  try {
    const res = await fetch(input, init);
    if (!res.ok || res.status === 400) {
      throw new Error("Cannot be fetched");
    }
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export default fetcher;
