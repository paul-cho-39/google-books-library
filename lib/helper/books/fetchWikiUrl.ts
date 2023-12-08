export default async function fetchWiki(query: string, limit: number = 3) {
   try {
      if (query) {
         const slugQuery = query.replaceAll(' ', '_');
         const res = await fetch(
            `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${slugQuery}&limit=${limit}`
         );
         const data = await res.json();
         return data;
      }
   } catch (err) {
      console.error(err);
   }
}
