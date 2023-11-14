import { useRouter } from 'next/router';
import { FilterProps } from '../types/googleBookTypes';

// ensures that the filter will only take into effect when the route changes
function useDecodeSearchRoute() {
   const router = useRouter();
   const { q, filterBy, view } = router.query;

   const filter: FilterProps = {
      filterBy: (filterBy
         ? decodeURIComponent(filterBy as string)
         : 'all') as FilterProps['filterBy'],
      filterParams: (view
         ? decodeURIComponent(view as string)
         : 'None') as FilterProps['filterParams'],
   };

   return { search: q as string, filter };
}

export default useDecodeSearchRoute;
