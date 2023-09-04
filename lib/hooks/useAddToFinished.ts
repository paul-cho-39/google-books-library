import queryKeys from "../queryKeys";
import bookApiUpdate, { ReadPostBody } from "../helper/books/bookApiUpdate";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  Method,
  UrlProps,
  Body,
  DeleteBody,
  FinishedPostBody,
} from "../types/fetcher/body";

type BookApi = typeof bookApiUpdate;

// example of typescript i guess
interface MutationProps<
  T extends ReadPostBody | DeleteBody | FinishedPostBody
> {
  method: T extends ReadPostBody
    ? "POST"
    : T extends DeleteBody
    ? "DELETE"
    : "PATCH" | "POST";
  userId: string;
  url: T extends FinishedPostBody ? "finished" : "update";
  body?: T;
  queryKey?: typeof queryKeys;
  options?: any;
}

// useMutation
function useAddToFinished<
  T extends ReadPostBody | DeleteBody | FinishedPostBody
>({
  method,
  userId,
  url,
  body,
  // queryKey =,
  options,
}: MutationProps<T>) {
  // options: Omit<UseMutationOptions<unknown, unknown, void, unknown>
  return useMutation(
    (params) => bookApiUpdate(method, userId, url, body),
    options
  );
}

export default useAddToFinished;

// from here I learned that in useMutation and useQuery
// the queryFn HAVE TO BE DEFINED!
