import { FilterParams } from '../../models/_api/fetchGoogleUrl';

export interface Data<T extends Record<string, string>> {
   pageParams?: unknown[] | [];
   pages: Array<Pages<T>>;
}

export interface Pages<T extends Record<string, string>> {
   items: Items<T>[];
   totalItems?: number;
   kind?: string;
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

// TODO: update ratings here
export type VolumeInfo = {
   authors: string[];
   averageRating?: number;
   ratingsCount?: number;
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
   infoLink?: string;
   language?: string;
   industryIdentifiers?: IndustryIdentifiers[];
};

export type IndustryIdentifiers = {
   type: 'ISBN_10' | 'ISBN-13' | 'ISSN' | 'OTHER';
   identifier: string;
};

type AccessInfo = {
   country: string;
   viewability: 'NO_PAGES' | 'PARTIAL' | 'ALL_PAGES'; // etc.
   embeddable: boolean;
   publicDomain: boolean;
   textToSpeechPermission: 'ALLOWED' | 'ALLOWED_FOR_ACCESSIBILITY' | 'NOT_ALLOWED';
   epub: {
      isAvailable: boolean;
      acsTokenLink?: string; // Only present if isAvailable is true
   };
   pdf: {
      isAvailable: boolean;
      acsTokenLink?: string; // Only present if isAvailable is true
   };
   webReaderLink: string;
   accessViewStatus: 'NONE' | 'SAMPLE' | 'FULL_PUBLIC_DOMAIN' | 'FULL_PURCHASED';
   quoteSharingAllowed: boolean;
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

export interface FilterProps {
   filterBy: 'all' | 'title' | 'author' | 'isbn';
   filterBookParams?: FilterParams;
}

export interface GoogleUpdatedFields {
   totalItems: number;
   items: {
      id: string;
      selfLink: string;
      volumeInfo: VolumeInfo;
      accessInfo: AccessInfo;
   }[];
}

export type ImageLinksPairs = Pick<ImageLinks, 'thumbnail' | 'smallThumbnail'>;
