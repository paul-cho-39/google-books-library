export interface ReviewData<NyData extends BookReview[] | BestSellerData> {
   copyright: string;
   num_results: number;
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
   publisher: string;
   rank: number;
   title: string;
   weeks_on_list: number;
}

interface Isbn {
   isbn10: string;
   isbn13: string;
}
