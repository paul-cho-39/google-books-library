function getTotalItemsLength(obj: Record<string, unknown[]>) {
   let totalCount = 0;
   for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
         totalCount += obj[key].length;
      }
   }
   return totalCount;
}

export default getTotalItemsLength;
