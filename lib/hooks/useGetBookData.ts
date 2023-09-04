import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import queryKeys from "../queryKeys";
import bookApiUpdate from "../helper/books/bookApiUpdate";

type Library = {
  finished: string[] | undefined;
  unfinished: string[] | undefined;
  wantToRead: string[] | undefined;
  currentlyReading: string[] | undefined;
};

export type QueryData = { library: Library };

export default function useGetBookData(userId: string) {
  const { data: dataBooks } = useQuery<QueryData>(
    queryKeys.userLibrary(userId),
    () => bookApiUpdate("GET", userId, "finished"),
    { enabled: !!userId, retry: true, retryDelay: (attempt) => attempt * 2000 }
  );
  return dataBooks;
}
