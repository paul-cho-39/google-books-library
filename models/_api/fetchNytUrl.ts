// some qualifiers include published dates
// book review resources
export interface ReviewQualifiers {
   author?: string;
   isbn?: number;
   title?: string;
}

export interface DateQualifiers {
   publishedDate?: string;
}

export interface CategoryQualifiers {
   type: 'fiction' | 'nonfiction' | 'trade-fiction';
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
      const { type, format } = this.processCategory(category) as CategoryQualifiers;
      const query = this.combineCategory(type, format);
      const date = this.getUrlByPublishedDate(publishedDate);
      const combinedCategory = `${date}/${query}`;

      return this.appendApiKey(
         `${NewYorkTimesApi.URL_BASE}${NewYorkTimesApi.BEST_SELLER_LISTS}${combinedCategory}.json?`
      );
   }

   public getReviewUrl(qualifiers: ReviewQualifiers) {
      const queryParts = [
         qualifiers.author && `?author=${encodeURIComponent(qualifiers.author)}`,
         qualifiers.isbn && `?isbn=${qualifiers.isbn}`,
         qualifiers.title && `?title=${encodeURIComponent(qualifiers.title)}`,
      ]
         .filter(Boolean)
         .join('&');
      return this.appendApiKey(
         `${NewYorkTimesApi.URL_BASE}${NewYorkTimesApi.BOOK_REVIEWS}?${queryParts}`
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

   private processCategory(category: CategoryQualifiers) {
      if (category.type === 'trade-fiction') {
         return { type: category.type, format: 'paperback' };
      }
      if (category.type === 'fiction' && category.format === 'paperback') {
         return { type: 'trade-fiction', format: 'paperback' };
      }
      return category;
   }
   private combineCategory(type: CategoryQualifiers['type'], format: CategoryQualifiers['format']) {
      const combinedQuery =
         format === 'paperback' && type === 'trade-fiction'
            ? `${type}-${format}`
            : `${format}-${type}`;
      return combinedQuery;
   }
}

const nytApi = new NewYorkTimesApi();
export default nytApi;
