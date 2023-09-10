const queryKeys = {
   books: ['books'] as const,
   bookLibrary: ['booklibrary'] as const,
   deleted: ['deleted'] as const,
   primary: ['booklibrary', 'primary'] as const,
   want: ['booklibrary', 'reading'] as const,
   currentlyReading: ['bookLibrary', 'currentlyReading'] as const,
   finished: ['booklibrary', 'finished'] as const,
   categories: (category: string | string[]) => ['category', { type: category }] as const,
   nytReview: (key: 'author' | 'isbn' | 'title', value: string) => [key, { value }] as const,
   nytBestSellers: (type: 'fiction' | 'non-fiction' | 'children', date: string | 'current') =>
      ['bestSellers', { type: type }, { date: date }] as const,
   singleBook: (bookId: string) => ['singebook', { bookId }],
   bookSearch: (search: string) => [...queryKeys.books, { search }] as const,
   userId: (id: string) => [...queryKeys.books, { id: id }] as const,
   userLibrary: (userId: string) => [...queryKeys.bookLibrary, { userId }] as const,
};

export default queryKeys;
