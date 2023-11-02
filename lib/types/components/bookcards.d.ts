export interface BookCardsProps {
   query: string;
   books: Array<Items<any>> | undefined;
   totalItems: number;
   userId: string | null;
}

export interface BookCardProps {
   query: string;
   book: Items<any> | undefined;
   totalItems: number;
   userId: string | null;
}
