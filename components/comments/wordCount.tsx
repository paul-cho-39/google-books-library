import { MAXIMUM_CONTENT_LENGTH } from '@/constants/inputs';

interface WordCountProps {
   comment: string;
}

const DisplayWordCount = ({ comment }: WordCountProps) => {
   const textColor =
      comment.length > MAXIMUM_CONTENT_LENGTH ? 'text-red-400' : 'text-black dark:text-white';
   return (
      <div
         className={`text-right text-xs ${textColor}`}
      >{`${comment.length} / ${MAXIMUM_CONTENT_LENGTH}`}</div>
   );
};

export default DisplayWordCount;
