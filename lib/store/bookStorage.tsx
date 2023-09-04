import create, { StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { Items, VolumeInfo } from "../types/googleBookTypes";
import { useState, useEffect } from "react";

type LibraryCache = {
  libraryCache: Partial<Array<Items<Record<string, string>>>> | undefined;
};

type BookStore = {
  libraryCache: Partial<Items<any>>[];
  // _hasHydrated: boolean;
  addBook: (data: Partial<Items<any>>[]) => void;
  // setHasHydrated: (state: boolean) => void;
  reset: () => void;
};

type MyPersist = (
  config: StateCreator<BookStore>,
  options: PersistOptions<BookStore>
) => StateCreator<BookStore>;

const emptySet = (set) => ({
  libraryCache: [],
  // setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
  addBook: (data) => set({ libraryCache: data }),
  reset: () => set({ libraryCache: [] }),
});

const usePersistedStore = create<BookStore>(
  (persist as MyPersist)(emptySet, {
    name: "book-store",
    // object from entries because have to make it to key-value object to store into cache
    partialize: (state) =>
      Object.fromEntries(
        Object.entries(state?.libraryCache).filter(
          ([key]) => ["id"].includes(key) || ["volumeInfo"].includes(key)
        )
      ),
  })
);

const useBookStore = (selector, compare) => {
  const store = usePersistedStore(selector, compare);
  const [isHydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  return isHydrated ? store : selector(emptySet);
};

export default useBookStore;

const keys = [
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
// const request = window.indexedDB.open("book-store", 0);

// request.onupgradeneeded = (event) => {
//   const db = event.target;
//   // use loop for this by creating an object?
//   db.createObjectStore("title", "title", { keyPath: "id" });
// }

// // error and success handlers
// request.onupgradeneeded = (event) => {
//   // if the event is on success
//   // const db = this.target;
//   // logic here
// db.createObjectStore("", { autoincrement: true})
// .createObjectIndex("author", { unique: false },
// .createObjectIndex("title", { unique: true }, ))

// db.transaction("book-store", 0).objectStore("book-store");
// }

// request.onerror =(event) => {
//   console.log("the database failed to load")
// }

// 1) use create store to store data
// 2) use store to filter the bookId number later on
// 3)

// Open a database.
// Create an object store in the database.

// Start a transaction and make a request to do some database operation, like adding or retrieving data.
// Wait for the operation to complete by listening to the right kind of DOM event.
// Do something with the results (which can be found on the request object).
