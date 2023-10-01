import { BookState } from '@prisma/client';
import { UserBookWithoutId } from './BookCreator';

type StateArgs = {
   day?: number;
   month?: number;
   year?: number;
   isPrimary?: boolean;
};

// this class creates the state handler
// should there be a separate handler for batch updates for this case?
export default class BookStateHandler {
   static getBookState(state: BookState, args: StateArgs) {
      switch (state) {
         case 'Finished':
            if (!args?.day || !args?.month || !args?.year) {
               throw new Error("Required parameters for 'finished' state not provided");
            }
            return this.createFinished(args.day, args.month, args.year);

         case 'Reading':
            const { isPrimary } = args;
            if (isPrimary !== undefined) {
               return this.createPrimary(isPrimary);
            }
            throw new Error("Required parameter 'isPrimary' for 'reading' state not provided");

         case 'Want':
            return this.createWant();

         default:
            throw new Error(`Unsupported state: ${state}`);
      }
   }

   // shouldReset(?) - if resetting this will reset everything;
   static createFinished(day: number, month: number, year: number): Partial<UserBookWithoutId> {
      return {
         state: 'Finished' as BookState,
         dateFinishedYear: year,
         dateFinishedMonth: month,
         dateFinishedDay: day,
         primary: false,
      };
   }
   // TODO: check the primary whether there should be primary
   static createPrimary(isPrimary: boolean): Partial<UserBookWithoutId> {
      return {
         state: 'Reading' as BookState,
         primary: isPrimary,
         primaryAdded: isPrimary ? new Date() : null,
      };
   }
   static createWant(): Partial<UserBookWithoutId> {
      return {
         state: 'Want' as BookState,
         primary: false,
      };
   }
}
