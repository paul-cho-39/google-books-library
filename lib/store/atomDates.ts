import { atom } from 'jotai';

export type InitialDateRecallerProps = {
   year: boolean;
   month: boolean;
   day: boolean;
};

// if date is unknown
// the value is -1 for the database since it is an integer in prisma
const initialNullDate = {
   year: -1,
   month: -1,
   day: -1,
};

// if true date is not known
export const initialDateRecaller = {
   year: false,
   month: false,
   day: false,
};

// <DateType<Date>>
export const initialDateAtom = atom<Date>(new Date());
export const initialNullDateAtom = atom(initialNullDate);
export const initialDateRecallerAtom = atom(initialDateRecaller);

// dependents of initialDateRecaller
export const isYearUnknownAtom = atom(
   (get) => get(initialDateRecallerAtom).year,
   (get, set) => {
      const recaller = get(initialDateRecallerAtom);
      set(initialDateRecallerAtom, {
         ...recaller,
         year: !recaller.year,
      });
   }
);

export const isMonthUnknownAtom = atom(
   (get) => get(initialDateRecallerAtom).month,
   (get, set) => {
      const recaller = get(initialDateRecallerAtom);
      set(initialDateRecallerAtom, {
         ...recaller,
         month: !recaller.month,
      });
   }
);

export const isDayUnknownAtom = atom(
   (get) => get(initialDateRecallerAtom).day,
   (get, set) => {
      const recaller = get(initialDateRecallerAtom);
      set(initialDateRecallerAtom, {
         ...recaller,
         day: !recaller.day,
      });
   }
);

export const getYear = atom((get) => {
   const isYearUnknown = get(initialDateRecallerAtom).year;
   const year = get(initialDateAtom).getFullYear();
   const nullYear = get(initialNullDateAtom).year;
   return isYearUnknown ? nullYear : year;
});

export const getMonth = atom((get) => {
   const isMonthUnknown = get(initialDateRecallerAtom).month;
   const month = get(initialDateAtom).getMonth();
   const nullYear = get(initialNullDateAtom).month;
   return isMonthUnknown ? nullYear : month;
});

export const getDay = atom((get) => {
   const isDayUnknown = get(initialDateRecallerAtom).day;
   const day = get(initialDateAtom).getDate();
   const nullYear = get(initialNullDateAtom).day;
   return isDayUnknown ? nullYear : day;
});

// resetting date and recaller
export const resetDateAtom = atom(null, (_get, set) => set(initialDateAtom, new Date()));
export const resetRecallerAtom = atom(null, (_get, set) =>
   set(initialDateRecallerAtom, {
      year: false,
      month: false,
      day: false,
   })
);
