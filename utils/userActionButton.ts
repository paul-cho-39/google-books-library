import RemovePrimary from '@/components/bookcards/removeCurrent';
import AddPrimary from '@/components/buttons/currentReadingButton';
import WantToReadButton from '@/components/buttons/wantReadButton';
import { Items } from '@/lib/types/googleBookTypes';

export const userActionButtons = [
   {
      name: 'reading',
      Component: AddPrimary,
   },
   {
      name: 'wanttoread',
      Component: WantToReadButton,
   },
   {
      name: 'removeCurrentlyReading',
      Component: RemovePrimary,
   },
];
