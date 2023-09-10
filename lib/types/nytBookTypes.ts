export interface BestSellerData {
   books: Books[];
   display_name: string;
   published_date: string;
}

export interface ReviewData {
   copyright: string;
   num_results: number;
   results: BookReview[];
}

export interface BookReview {
   book_author: string | string[];
   book_title: string;
   byline: string;
   publication_dt: string;
   summary: string;
   url: string;
}

export interface Books {
   author: string;
   book_image: string;
   description: string;
   isbn: Isbn[];
   publisher: string;
   rank: number;
   title: string;
   weeks_on_list: number;
}

interface Isbn {
   isbn10: string;
   isbn13: string;
}
