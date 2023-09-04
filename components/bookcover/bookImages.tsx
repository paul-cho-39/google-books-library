import Image from "next/image";
import { ImageLinks } from "../../lib/types/googleBookTypes";
import { getAvailableThumbnail } from "../../lib/helper/books/editBookPageHelper";

const BookImage = ({
  bookImage,
  title,
}: {
  bookImage: ImageLinks;
  title: string;
}) => {
  const thumbnail = getAvailableThumbnail(bookImage);

  return (
    <div className="w-full inline-flex items-center justify-center divide-y-2 divide-gray-400 mb-8">
      <Image
        src={thumbnail}
        alt={`Picture of ${title} cover`}
        priority
        width={135}
        height={185}
      />
    </div>
  );
};

export default BookImage;
