import { Method, UrlProps, Body } from "../../types/fetcher/body";
import { Items } from "../../types/googleBookTypes";

export const getBody = (userId: string, book: Items<any>) => {
  const { id, volumeInfo } = book;
  const { industryIdentifiers, authors, categories, imageLinks, ...rest } =
    volumeInfo;
  const body = {
    userId,
    id,
    industryIdentifiers,
    imageLinks,
    authors,
    categories,
    ...rest,
  };
  // const snapShotData = { id, userId };
  return body;
};

export type ReadPostBody = ReturnType<typeof getBody>;
// export type ReadPostBody = Omit<ReturnType<typeof getBody>, "snapShotData">;

// fetcher for updating buttons
const bookApiUpdate = async (
  method: Method,
  userId: string,
  url: UrlProps,
  body?: Body
) => {
  const res = await fetch(`/api/books/${userId}/${url}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res && res.json();
};

export default bookApiUpdate;
