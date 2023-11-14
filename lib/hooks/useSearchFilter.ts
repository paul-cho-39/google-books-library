import { useContext } from 'react';
import { FilterContextParams } from '../types/theme';
import { SearchFilterContext } from '../context/SearchFilterContext';

function useSearchFilter() {
   const context = useContext<FilterContextParams | null>(SearchFilterContext);

   if (!context) {
      throw new Error('At least one component must be used within SearchContextProvider component');
   }

   const { filter, setFilter } = context;

   return { filter, setFilter };
}

export default useSearchFilter;
