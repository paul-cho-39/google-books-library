export const formatDate = (dateString: string) => {
   const date = new Date(dateString);
   const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
   ];

   const day = date.getDate();
   const monthIndex = date.getMonth();
   const year = date.getFullYear();

   return `${monthNames[monthIndex]}-${day < 10 ? '0' + day : day}-${year}`;
};
