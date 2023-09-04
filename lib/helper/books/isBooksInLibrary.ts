export function isBooksInLibrary(
  id: string,
  bookData: string[] | undefined,
  bookIdsCache: string[] | undefined
) {
  let data: boolean | undefined;
  let cache: boolean | undefined;
  if (typeof bookData === "undefined") {
    data = true;
  }
  if (typeof bookIdsCache === "undefined") {
    cache = true;
  }
  return bookData && bookIdsCache
    ? isBookInLib(id, bookData) || isBookInLib(id, bookData)
    : data && bookIdsCache // bookData is undefined and cache has
    ? isBookInLib(id, bookIdsCache) || data
    : cache && bookData
    ? cache || isBookInLib(id, bookData)
    : (cache as boolean) || (data as boolean);
}

// helper function
function isBookInLib(id: string, bookData: string[]) {
  return bookData.some((bookId) => bookId === id);
}

export function isBookInData(id: string, bookData?: string[]) {
  return bookData ? isBookInLib(id, bookData) : false;
}
