// some qualifiers include published dates
// book review resources
interface ReviewQualifiers {
   author?: string;
   isbn?: number;
   title?: string;
}

export interface DateQualifiers {
   publishedDate?: string;
}

interface CategoryQualifiers {
   type: 'fiction' | 'non-fiction' | 'children';
   format: 'hardcover' | 'paperback' | 'combined-print-and-e-book';
}

export interface NewYorkTimesQualifiers {
   reviews: ReviewQualifiers;
   publisheDate: DateQualifiers | 'current';
   category: CategoryQualifiers;
}

class NewYorkTimesApi {
   private static URL_BASE = `https://api.nytimes.com/svc/books/v3`;
   private static BEST_SELLER_LISTS = '/lists/';
   private static BOOK_REVIEWS = '/reviews.json';
   private static KEY = process.env.NEXT_PUBLIC_NYT_KEY || '';

   public getUrlByCategory(
      category: CategoryQualifiers = { type: 'fiction', format: 'combined-print-and-e-book' },
      publishedDate: DateQualifiers | 'current' = 'current'
   ) {
      const year =
         publishedDate !== 'current' && Number(publishedDate.publishedDate?.split('-')[0]);
      // Return false if the date is before 2008
      //   The api date returns to 2008
      if (year && year < 2008) {
         console.warn(
            'The New York Times best-seller list data is available for years after 2008.'
         );
      }

      const date = this.getUrlByPublishedDate(publishedDate);
      const combinedCategory = `${date}/${category.format}-${category.type}?`;

      return this.appendApiKey(
         `${NewYorkTimesApi.URL_BASE}${NewYorkTimesApi.BEST_SELLER_LISTS}${combinedCategory}.json`
      );
   }

   public getReviewUrl(qualifiers: ReviewQualifiers) {
      let query = '';
      if (qualifiers.author) query += `author=${encodeURIComponent(qualifiers.author)}&`;
      if (qualifiers.isbn) query += `isbn=${qualifiers.isbn}&`;
      if (qualifiers.title) query += `title=${encodeURIComponent(qualifiers.title)}&`;
      return this.appendApiKey(
         `${NewYorkTimesApi.URL_BASE}${NewYorkTimesApi.BOOK_REVIEWS}?${query}`
      );
   }

   private getUrlByPublishedDate(publishedDate: DateQualifiers | 'current') {
      if (publishedDate === 'current') {
         return publishedDate;
      } else {
         const date = publishedDate.publishedDate;
         return `publishedDate=${date}`;
      }
   }

   private appendApiKey(url: string) {
      if (NewYorkTimesApi.KEY === '') {
         console.warn(
            'The current key does not contain any key. Go to New York Times developer portal to acquire one.'
         );
         return url;
      }
      console.log('url is: ', url);
      return `${url}api-key=${NewYorkTimesApi.KEY}`;
   }
}

const nytApi = new NewYorkTimesApi();
export default nytApi;
