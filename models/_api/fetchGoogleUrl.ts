import { Categories } from '../../constants/categories';

interface QueryQualifiers {
   inauthor?: string;
   intitle?: string;
   isbn?: string;
   subject?: Categories;
   publishedDate?: PublishedDate;
}

interface PublishedDate {
   start?: string;
   end?: string;
}

export interface MetaProps {
   maxResultNumber: number;
   pageIndex: number;
   byNewest?: boolean;
}

class GoogleBookApi {
   private static URL_BASE = 'https://www.googleapis.com/books/v1/volumes?q=';
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
      const url = `${GoogleBookApi.URL_BASE}isbn:${isbn}`;
      return this.appender(url);
   }

   public getUrlBySubject(subject: Categories, meta?: MetaProps) {
      const url = `${GoogleBookApi.URL_BASE}subject:${subject}`;
      return this.appender(url, meta);
   }

   // use individual books to get higher quality images
   // WARNING: some higher quality images do not match the book
   public getUrlByBookId(id: string) {
      return GoogleBookApi.URL_BASE + id;
   }
   public addPublishedDate(url: string, publishedDate: PublishedDate, meta?: MetaProps) {
      const date = this.isPublishedDate(publishedDate);
      const query = `+publishedDate:${date}`;
      this.checkUrl(url);
      const newUrl = url + query;
      return this.appender(newUrl, meta);
   }
   private appendCommonParams(
      url: string,
      maxResultNumber: number = 15,
      pageIndex: number = 0,
      byNewest?: boolean
   ) {
      const max = maxResultNumber > 40 ? 40 : maxResultNumber;
      const orderBy = byNewest ? 'orderBy=newest' : 'orderBy=relevance';

      return `${url}&startIndex=${pageIndex}&maxResults=${max}&${orderBy}&printType=books&`;
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
   private isPublishedDate(key: PublishedDate) {
      const { start, end } = key;
      if (start && end) {
         return `${start}-${end}`;
      } else if (start) {
         return `>${start}`;
      } else if (end) {
         return `<${end}`;
      }

      return '';
   }

   private constructMultipleQueries(qualifiers: QueryQualifiers) {
      return Object.entries(qualifiers)
         .map(([key, value]) => {
            value = key === 'publishedDate' ? this.isPublishedDate(value) : value;
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
