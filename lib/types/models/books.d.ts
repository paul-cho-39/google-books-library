import { Book } from '@prisma/client';
import { IndustryIdentifiers } from '../googleBookTypes';

export type BaseNullIdParams = {
   userId: string | null;
   bookId: string;
};

export type BaseIdParams = {
   userId: string;
   bookId: string;
};

export interface DataWithRatings {
   bookData: Data;
   rating: number;
}

export interface RatingsWithoutData {
   rating: number;
   bookData?: Data;
}

export interface Data {
   title: string;
   subtitle: string;
   publishedDate: string | Date;
   language: string;
   pageCount: number;
   categories: string[];
   authors: string[];
   industryIdentifiers?: string[];
}

export interface LibraryData extends Data {
   id: string;
}

export interface IdParams {
   userId: string;
   id: string;
}

export type MutationLibraryActionTypes = 'finished' | 'reading' | 'want' | 'remove' | 'delete';
export type RefinedBookState = 'want' | 'reading' | 'finished' | 'unfinished';
export type Library = Record<RefinedBookState, string[] | undefined>;

export type AddLibraryType = { data: LibraryData };
export type RemoveLibraryType = IdParams; // should omit userId since it is route?

export interface FinishedBookBody extends LibraryData {
   year: number;
   month: number;
   day: number;
}

export type MutationLibraryBodyTypes = {
   finished: FinishedBookBody;
   reading: AddLibraryType;
   want: AddLibraryType;
   remove: RemoveLibraryType;
   delete: RemoveLibraryType;
};

type IgnorePrismaBuiltins<S extends string> = string extends S
   ? string
   : S extends ''
   ? S
   : S extends `$${infer T}`
   ? never
   : S;

export type PrismaModelName = IgnorePrismaBuiltins<keyof PrismaClient>;
