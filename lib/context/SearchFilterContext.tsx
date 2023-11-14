import { createContext, useState, useEffect } from 'react';
import { FilterProps } from '../types/googleBookTypes';
import { FilterContextParams } from '../types/theme';

export const SearchFilterContext = createContext<FilterContextParams | null>(null);

const SearchFilterProvider = ({ children }: { children: React.ReactNode }) => {
   const [filter, setFilter] = useState<FilterProps>({
      filterBy: 'all',
      filterParams: 'None',
   });

   return (
      <SearchFilterContext.Provider value={{ filter, setFilter }}>
         {children}
      </SearchFilterContext.Provider>
   );
};

export default SearchFilterProvider;
