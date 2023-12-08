import { CurrentOrReadingProps } from "../../../pages";

type Data = CurrentOrReadingProps["data"];

const primaryOrCurrent = <T extends Data | undefined>(
  current: T,
  primary: T
) => {
  return {
    current: getBookById(current),
    primary: getBookById(primary),
  };
};

export function getBookById<T extends Data | undefined>(data: T) {
  return data && data.map((d) => d.book?.id);
}

export function filterData<T extends Data | undefined>(data: T) {
  return data?.map((d) => d.primary);
}

type Testing = keyof CurrentOrReadingProps["data"];

export default primaryOrCurrent;
