export const changeDirection = (
   width: number,
   itemIndex: number,
   totalColumns: number,
   threshold: number = totalColumns - 1,
   padding: number
) => {
   const offsetBy = 8;
   const currentIndex =
      itemIndex === totalColumns || itemIndex % totalColumns === 0
         ? totalColumns
         : itemIndex % totalColumns;

   if (currentIndex >= threshold) {
      const mult = totalColumns + 1 - currentIndex;
      return {
         right: (padding + width) * mult + offsetBy,
         left: 0,
      };
   }

   return { left: (padding + width) * currentIndex - offsetBy, right: 0 };
};
