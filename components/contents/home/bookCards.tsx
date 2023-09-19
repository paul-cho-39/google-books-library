import { CurrentOrReadingProps } from '../../../pages';
import ShowCurrentBooks from './editBook';
import { useMutation, useQuery } from '@tanstack/react-query';
import primaryOrCurrent, { filterData } from '../../../lib/helper/books/primaryOrCurrent';
import queryKeys from '../../../lib/queryKeys';
import bookApiUpdate from '../../../lib/helper/books/bookApiUpdate';

// CHANGE THE PROPS
interface BookCardsProps {
   data: CurrentOrReadingProps['data'];
   userId: string;
}
// TODO // make sure to limit the number of currently reading books
// as of now set at max = 10;
// ^^ should this be prisma.$use? OR just set for whenever currentBook
// is called?

// refactor this part too
const BookCards = ({ data, userId }: BookCardsProps) => {
   const currentlyReading = filterData(data);
   console.log('currentlyReading is:', currentlyReading);
   //  const primaryReading = filterData(data, 'primary');
   //  //   testing purpose should have it as a params

   //  const id = data.map((d) => d.book.id)[1]?.toString();

   //  //   lazy load this one?
   //  const { data: example } = useQuery(queryKeys.notRecording(), () =>
   //     primaryOrCurrent(currentlyReading, primaryReading)
   //  );

   //  const body = { id, userId };
   //  // useMutation to mutate the data whenever clicking?
   //  const { mutate } = useMutation(queryKeys.recording(), () =>
   //     bookApiUpdate('POST', userId, 'primary', body)
   //  );

   return (
      // if data.length > 2 ? currentOrPrimary : DisplaySingleOrDouble
      // a button for change main book & finished reading
      // have the button disabled
      // when clicked change => cancel & save changes
      //
      <>
         {/* <ShowCurrentBooks  data={data} mutate={() => mutate()} /> */}
         {/* if the image is undefined then thumbnail */}
      </>
   );
};

export default BookCards;

// have the keys and call patch or post to mutate the data
