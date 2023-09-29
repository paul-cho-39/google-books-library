export const getBookWidth = (height: number, ratio?: number) => {
   if (ratio) {
      return height * ratio;
   }
   return height * (3 / 4.25);
};

export const getContainerWidth = (height: number, ratio: number, isLargeScreen: boolean) => {
   const r = isLargeScreen ? ratio : ratio - 1;
   return r * height;
};
