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
}

class GoogleBookApi {
   private static URL_BASE = 'https://www.googleapis.com/books/v1/volumes?q=';
   private static KEY = process.env.NEXT_PUBLIC_GOOGLE_KEY || '';

   public getCompleteUrlWithQualifiers(
      qualifiers: QueryQualifiers,
      maxResultNumber: number = 15,
      pageIndex: number = 0
   ) {
      const query = this.constructMultipleQueries(qualifiers);
      const url = `${GoogleBookApi.URL_BASE}${query}`;
      return this.appendCommonParams(url, maxResultNumber, pageIndex);
   }

   public getUrlByQuery(query: string, maxResultNumber?: number, pageIndex?: number) {
      const url = `${GoogleBookApi.URL_BASE}+inauthor:${query}`;
      return this.appendCommonParams(url, maxResultNumber, pageIndex);
   }

   public getUrlByAuthor(author: string) {
      const url = `${GoogleBookApi.URL_BASE}+inauthor:${author}`;
      return this.appendCommonParams(url);
   }

   public getUrlByIsbn(isbn: string, maxResultNumber?: number) {
      const url = `${GoogleBookApi.URL_BASE}isbn:${isbn}`;
      return this.appendCommonParams(url, maxResultNumber);
   }

   public getUrlBySubject(subject: Categories, meta?: MetaProps) {
      const url = `${GoogleBookApi.URL_BASE}subject:${subject}`;
      return this.appendCommonParams(url, meta?.maxResultNumber, meta?.pageIndex);
   }

   // use individual books to get higher quality images
   // WARNING: some higher quality images do not match the book
   public getUrlByBookId(id: string) {
      return GoogleBookApi.URL_BASE + id;
   }
   public addMeta(url: string, meta: MetaProps) {
      this.checkUrl(url);
      return this.appendCommonParams(url, meta.maxResultNumber, meta.pageIndex);
   }
   public addPublishedDate(
      url: string,
      publishedDate: PublishedDate,
      maxResultNumber?: number,
      pageIndex?: number
   ) {
      const date = this.isPublishedDate(publishedDate);
      const query = `+publishedDate:${date}`;
      this.checkUrl(url);
      const newUrl = url + query;
      return this.appendCommonParams(newUrl, maxResultNumber, pageIndex);
   }
   private appendCommonParams(
      url: string,
      maxResultNumber: number = 15,
      pageIndex: number = 0,
      key: string = GoogleBookApi.KEY
   ) {
      if (key == '') {
         throw console.warn(
            'The current key does not contain any key. Go to google developer tool to acquire one'
         );
      }
      return `${url}&startIndex=${pageIndex}&maxResults=${maxResultNumber}&orderBy=relevance&printType=books&key=${key}`;
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
