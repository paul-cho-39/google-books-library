import { ReadPostBody } from "../../helper/books/bookApiUpdate";

export type DeleteBody = { id: string; userId: string };
export type FinishedPostBody = ReadPostBody & {
  month: number;
  year: number;
  day: number;
};

export type Body = ReadPostBody | DeleteBody | FinishedPostBody;
export type Method = "POST" | "DELETE" | "GET" | "PATCH";
export type UrlProps = "reading" | "finished" | "want" | "primary";
