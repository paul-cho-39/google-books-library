// add pages here and add title and meta info here
const metaHeaders = {
    books: {
        title: (title: string) => `${title}`,
        meta: (title: string) => [
          { name: 'description', content: `Dive into ${title}! Explore ratings, author insights, and captivating details that bring this book to life.` },
          { name: 'keywords', content: `${title}, book details, author information, book ratings, book genres` },
          { name: 'robots', content: 'index,follow' }
        ],
      },
      search: {
        title: 'Find Books Instantly',
        meta: () => [
          { name: 'description', content: `Looking for a specific book or author? Search our extensive library. From classics to contemporary reads, find exactly what you're searching for.` },
          { name: 'keywords', content: `search, books, google books` },
          { name: 'robots', content: 'index,follow' }
        ],
      },
      categories: {
        title: (category: string) => `Explore Books by ${category}`,
        meta: () => [
          { name: 'description', content: `Browse over book categories. Whether you're into romance, science fiction, or non-fiction, find your next read in your favorite genre.` }
        ]
      },
      home: {
        title: 'Welcome to Your Book Explorer',
        meta: () => [
          { name: 'description', content: `Step into a world full of different books that you did not know it existed. Start your literary adventure here!` }
        ]
      },
    signin: {
        title: `Sign in - Discover More Books`,
        meta: () => [
            { name: 'description', content: `Join our book-loving community! Sign in to access personalized book recommendations and unlock a world of reading.` }
          ]
        },
    signup: {
        title: `Sign up for ${process.env.NEXTAUTH_URL} `,
        meta: () => [
            { name: 'description', content: `Join our book-loving community! Sign in to access personalized book recommendations and unlock a world of reading.` }
          ]
    },
    error404: {
        title: 'Page Not Found',
        meta: () => [
            { name: 'description', content: 'Oops! The page you are looking for does not exist. It might have been moved or deleted.' },
            { name: 'robots', content: 'noindex,follow' } 
    ],
  },
  error500: {
    title: 'Server Error',
    meta: () => [
      { name: 'description', content: 'Sorry, something went wrong on our end. Please try again later.' },
      { name: 'robots', content: 'noindex,follow' }
    ],
  },
}

export default metaHeaders;