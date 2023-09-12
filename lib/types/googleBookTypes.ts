export interface Data<T extends Record<string, string>> {
   pageParams?: unknown[] | [];
   pages: Array<Pages<T>>;
}

export interface Pages<T extends Record<string, string>> {
   items: Array<Items<T>>;
   kind: string;
   totalItems: number;
}

export interface Items<T extends Record<string, string>> {
   accessInfo?: T;
   readonly etag?: string;
   id: string;
   readonly kind?: string;
   saleInfo?: T;
   searchInfo?: T;
   readonly selfLink?: string;
   volumeInfo: VolumeInfo;
}

export type VolumeInfo = {
   authors: string[];
   averageRating?: number;
   categories?: string[];
   description?: string;
   pageCount?: number;
   publishedDate?: string;
   publisher?: string;
   subtitle?: string;
   title: string;
   imageLinks?: {
      thumbnail: string;
      smallThumbnail: string;
   };
   language?: string;
   industryIdentifiers?: IndustryIdentifiers[];
};

export type IndustryIdentifiers = {
   type: 'ISBN_10' | 'ISBN-13' | 'ISSN' | 'OTHER';
   identifier: string;
};

export type BookIdProps = { id: string };

export interface SingleBook {
   // id: string;
   authors: string[];
   categories: string[];
   description: string;
   imageLinks?: ImageLinks;
   industryIdentifiers: IndustryIdentifiers[];
   language: string;
   pageCount: number;
   publishedDate: string;
   publisher: string;
   subtitle: string;
   title: string;
}

export type ImageLinks = {
   extraLarge?: string;
   large?: string;
   medium?: string;
   small?: string;
   smallThumbnail?: string;
   thumbnail?: string;
};

export type ImageLinksPairs = Pick<ImageLinks, 'thumbnail' | 'smallThumbnail'>;
