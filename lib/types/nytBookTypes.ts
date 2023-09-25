export interface ReviewData<NyData extends BookReview[] | BestSellerData> {
   copyright?: string;
   num_results?: number;
   results: NyData;
   //    results: BookReview[] | BestSellerData;
}

export interface BookReview {
   book_author: string | string[];
   book_title: string;
   byline: string;
   publication_dt: string;
   summary: string;
   url: string;
}

export interface BestSellerData {
   bestsellers_date: string;
   books: Books[];
   display_name: string;
   published_date: string;
}

export interface Books {
   author: string;
   book_image: string;
   description: string;
   isbn: Isbn[];
   primary_isbn13: string;
   publisher: string;
   title: string;
   rank: number;
   rank_last_week: number;
   weeks_on_list: number;
}

interface Isbn {
   isbn10: string;
   isbn13: string;
}
