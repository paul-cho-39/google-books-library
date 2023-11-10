import RemovePrimary from '@/components/bookcards/removeCurrent';
import AddPrimary from '@/components/buttons/currentReadingButton';
import WantToReadButton from '@/components/buttons/wantReadButton';
import DeleteButtonWrapper from '@/components/buttons/wrappers/deleteButtonWrapper';

// would be better to create HOC for this component
// unnecessarily repeating logic here
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
   {
      name: 'Delete',
      Component: DeleteButtonWrapper,
   },
];
