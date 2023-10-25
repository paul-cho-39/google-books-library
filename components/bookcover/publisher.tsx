import { formatDate } from '@/lib/helper/books/formatBookDate';

const BookPublisher = ({ date, className }: { date: string | undefined; className?: string }) => {
   if (!date) return <></>;

   return (
      <div className={className}>
         <span>Published: </span>
         {formatDate(date)}
      </div>
   );
};

export default BookPublisher;
