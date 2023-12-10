import { Book } from '@prisma/client';
import { IndustryIdentifiers } from '../googleBookTypes';
import { SingleRatingData } from '@/lib/types/serverTypes';

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

export type UserActionButtonProps = {
   book: Items<any>;
   userId: string;
   close?: () => void;
   className?: string;
};

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

export type ToastUserActionType = 'removed' | 'added' | 'error' | 'none';
export type MutationLibraryActionTypes = 'finished' | 'reading' | 'want' | 'remove' | 'delete';
export type RefinedBookState = 'want' | 'reading' | 'finished' | 'unfinished';
export type Library = Record<RefinedBookState, string[] | undefined>;

export type AddLibraryType = { data: LibraryData };
export type RemoveLibraryType = IdParams; // should omit userId since it is route?

export interface FinishedBookBody {
   year: number;
   month: number;
   day: number;
   data: LibraryData;
}

export type MutationLibraryBodyTypes = {
   finished: FinishedBookBody;
   reading: AddLibraryType;
   want: AddLibraryType;
   remove: RemoveLibraryType;
   delete: RemoveLibraryType;
};

export type BookMutationBaseParams = {
   userId: string;
   bookId: string;
   type: MutationLibraryActionTypes;
};

export type MutationLibraryBodyData<MBody extends MutationLibraryActionTypes> =
   MutationLibraryBodyTypes[MBody];

type IgnorePrismaBuiltins<S extends string> = string extends S
   ? string
   : S extends ''
   ? S
   : S extends `$${infer T}`
   ? never
   : S;

export type PrismaModelName = IgnorePrismaBuiltins<keyof PrismaClient>;

// useMutateRatings types here
export interface InitializeDataParams extends MutationBase {
   queryClient: QueryClient;
}

export type MutationRatingActionType = 'create' | 'update' | 'remove';
export type MutationRatingDataTypes = {
   create: DataWithRatings;
   update: RatingsWithoutData;
   remove: null;
};
export type MutationRatingData<ActionType extends MutationRatingActionType> =
   MutationRatingDataTypes[ActionType];

export interface MutationBase {
   userId: string;
   bookId: string;
   inLibrary: boolean;
   prevRatingData: SingleRatingData | undefined;
}

// export interface MultipleQueryDataParams extends Omit<MutationBase, 'initialData'> {
//    queryClient: QueryClient;
//    context:
//       | {
//            prevRatingData: SingleRatingData | undefined;
//            action: MutationRatingActionType;
//         }
//       | undefined;
//    newRating: number | undefined;
// }

export interface MultipleQueryDataParams extends MutationBase {
   action: MutationRatingActionType;
   newRating: number | undefined;
}
