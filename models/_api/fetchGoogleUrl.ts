import { Categories } from '@/constants/categories';

interface QueryQualifiers {
   inauthor?: string;
   intitle?: string;
   isbn?: string;
   subject?: Categories;
   filter?: FilterParams;
}

export type FilterParams = 'partial' | 'full' | 'free-ebooks' | 'paid-ebooks' | 'ebooks' | 'None';

export interface MetaProps {
   maxResultNumber: number;
   pageIndex: number;
   byNewest?: boolean;
}

// there are two types of data that should be returned
// one with updated 'FIELDS' and the other with 'url_by_id'

// 'URL_BY_ID' is returned when page is refreshed or remounted when there is no cache available
// otherwise it returns "FIELDS" data
// 'URL_BY_ID' does not contain google keys because it will return http status 503
// only returns data without google keys
class GoogleBookApi {
   private static URL_BASE = 'https://www.googleapis.com/books/v1/volumes?q=';
   private static URL_BY_ID = 'https://www.googleapis.com/books/v1/volumes/';
   private static FIELDS =
      'totalItems,items(id,accessInfo,selfLink,volumeInfo/authors,volumeInfo/averageRating,volumeInfo/ratingsCount,volumeInfo/categories,volumeInfo/description,volumeInfo/pageCount,volumeInfo/publishedDate,volumeInfo/publisher,volumeInfo/subtitle,volumeInfo/title,volumeInfo/imageLinks,volumeInfo/infoLink,volumeInfo/language,volumeInfo/industryIdentifiers,volumeInfo/averageRating,volumeInfo/ratingsCount)';
   private static KEY = process.env.NEXT_PUBLIC_GOOGLE_KEY || '';

   public getCompleteUrlWithQualifiers(qualifiers: QueryQualifiers, meta?: MetaProps) {
      const query = this.constructMultipleQueries(qualifiers);
      const url = `${GoogleBookApi.URL_BASE}${query}`;
      return this.appender(url, meta);
   }

   public getUrlByQuery(query: string, meta?: MetaProps) {
      const url = `${GoogleBookApi.URL_BASE}+${query}`;
      return this.appender(url, meta);
   }

   public getUrlByAuthor(author: string, meta?: MetaProps) {
      const url = `${GoogleBookApi.URL_BASE}+inauthor:${author}`;
      return this.appender(url, meta);
   }

   public getUrlByIsbn(isbn: string) {
      const url = `${GoogleBookApi.URL_BASE}isbn:${isbn}&fields=${GoogleBookApi.FIELDS}`;
      return url;
   }

   public getUrlBySubject(subject: Categories | string, meta?: MetaProps) {
      const url = `${GoogleBookApi.URL_BASE}subject:${subject}`;
      return this.appender(url, meta);
   }
   // use individual books to get higher quality images
   // WARNING: some higher quality images do not match the book
   public getUrlByBookId(id: string) {
      return GoogleBookApi.URL_BY_ID + id;
   }
   private appendCommonParams(
      url: string,
      maxResultNumber: number = 15,
      pageIndex: number = 0,
      byNewest?: boolean
   ) {
      const max = maxResultNumber > 40 ? 40 : maxResultNumber;
      const orderBy = byNewest ? 'orderBy=newest' : 'orderBy=relevance';

      return `${url}&startIndex=${pageIndex}&maxResults=${max}&${orderBy}&printType=books&fields=${GoogleBookApi.FIELDS}&`;
   }
   private appendKeys(url: string, key: string = GoogleBookApi.KEY) {
      if (key == '') {
         throw console.warn(
            'The current key does not contain any key. Go to google developer tool to acquire one'
         );
      }
      return `${url}key=${key}`;
   }
   private appender(url: string, meta?: MetaProps) {
      return !meta
         ? this.appendKeys(url)
         : this.appendKeys(
              this.appendCommonParams(url, meta.maxResultNumber, meta.pageIndex, meta.byNewest)
           );
   }
   private constructMultipleQueries(qualifiers: QueryQualifiers) {
      return Object.entries(qualifiers)
         .filter(([key, value]) => key && value)
         .map(([key, value]) => {
            if (key === 'filter') {
               return value === 'None' ? '' : `&filter=${value}`;
            }
            return `+${key}:${value}`;
         })
         .join('');
   }

   private checkUrl(url: string) {
      const len = GoogleBookApi.URL_BASE.length;
      if (url.slice(0, len) !== GoogleBookApi.URL_BASE) {
         throw new Error('Invalid google url. Provide the correct url for query');
      }
   }
}

const googleApi = new GoogleBookApi();
export default googleApi;
