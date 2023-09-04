export default function filterId(book: string[] | undefined, id: string) {
  return book?.filter((bookId) => bookId !== id);
}
