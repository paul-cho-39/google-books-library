import RemovePrimary from '@/components/bookcards/removeCurrent';
import AddPrimary from '@/components/buttons/currentReadingButton';
import WantToReadButton from '@/components/buttons/wantReadButton';

export const userActionButtons = [
   {
      name: 'Reading',
      Component: AddPrimary,
   },
   {
      name: 'Want to read',
      Component: WantToReadButton,
   },
   {
      name: 'Remove current',
      Component: RemovePrimary,
   },
];
