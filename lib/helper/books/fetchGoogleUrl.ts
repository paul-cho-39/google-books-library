import { Categories } from '../../../constants/categories';

export const fetcher = async (input: RequestInfo, init?: RequestInit) => {
   try {
      const res = await fetch(input, init);
      if (!res.ok || res.status === 400) {
         throw new Error('Cannot be fetched');
      }
      return res.json();
   } catch (error) {
      console.log(error);
   }
};

// THIS CAN BE COMBINED IN THE QUERY:
// CATEGORIES AND LISTS
// intitle
// inauthor
// inpublisher
// subject
// isbn
// publishedDate
// e.g.: https://www.googleapis.com/books/v1/volumes?q=inauthor:J.K. Rowling+intitle:Harry Potter+subject:Fiction+publishedDate:>1997&key=YOUR_API_KEY

// using this very information can combine and filter the result here

// git ignore this(?)

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

   private appendCommonParams(
      url: string,
      maxResultNumber: number = 15,
      pageIndex: number = 0,
      key: string = process.env.NEXT_PUBLIC_GOOGLE_KEY || ''
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

   public getUrlBySubject(subject: Categories) {
      const url = `${GoogleBookApi.URL_BASE}subject:${subject}`;
      return this.appendCommonParams(url);
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
}

const googleApi = new GoogleBookApi();
export default googleApi;

// // TODO: refactor this part to filter out the result
// // maybe make this into a class?

// const URL_BASE = "https://www.googleapis.com/books/v1/volumes?q=";
// export const getCompleteUrl = (
//   search: string,
//   maxResultNumber: number = 15,
//   pageIndex: number = 0
// ): string => {
//   const index = `&startIndex=${pageIndex}`;
//   const maxResult = `&maxResults=${maxResultNumber}`;
//   const rest = `&orderBy=relevance&printType=books&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`;

//   return URL_BASE + search + index + maxResult + rest;
// };

// export const getAuthorUrl = (author: string) => {
//   const authorUrl = `+inauthor:${author}`;
//   const rest = `&orderBy=relevance&printType=books&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`;

//   return URL_BASE + authorUrl + rest;
// };

// // add key but a different one?
// export const getGoogleByIsbn = (isbn: string, maxResultNumber: number = 20) => {
//   const getIsbn = `isbn:${isbn}`;
//   const maxResult = `&maxResults=${maxResultNumber}`;

//   return URL_BASE + getIsbn + maxResult;
// };

// // have the subject into either .json or objects and have them into types
// export const getDataBySubect = (subject: Categories) => {
//   const subjectUrl = `subject:${subject}`;
//   return URL_BASE + subjectUrl +
// }

// // add key but a different one?
// export const getDataByVolumeId = (id: string) => {
//   const keys = `&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`;
//   return URL_BASE + id;
// };
