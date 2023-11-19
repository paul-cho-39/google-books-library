import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { fetchWiki, fetcher } from '@/utils/fetchData';
import queryKeys from '@/utils/queryKeys';

export default function Author({}) {
   // console.log(props);
   const router = useRouter();
   const { slug: author } = router.query as { slug: string };

   const { data: example } = useQuery(queryKeys.wiki(author), () => fetchWiki(author as string));

   const getThumbnail = () => {
      const thumbnail =
         example && example?.pages.map((page: { thumbnail: any }) => page.thumbnail)[0];
      const thumbnailUrl = thumbnail && thumbnail.url.toString();
      const replacedThumbnail = thumbnailUrl && thumbnailUrl.replace('/60px', '/240px');
      return thumbnail ? 'https:' + replacedThumbnail : '/unavailableThumbnail.png';
   };

   if (!author)
      return (
         <div className='min-h-full w-full mx-auto dark:slate-800'>
            <div className='flex flex-row text-center'>
               <button className='dark:text-slate-200 text-2xl'>Go back</button>
               <h3 className='dark:text-slate-200 text-3xl'>No author to display here</h3>
            </div>
         </div>
      );

   return (
      <div className='min-h-full w-full mx-auto dark:slate-800'>
         <h3 className='dark:text-slate-200 text-3xl'>Welcome to the Authors Page</h3>
         <Image src={getThumbnail()} alt={author} width={360} height={300} />
         <p className='text-slate-800 dark:text-slate-200 lg:text-xl'>
            Probably the wrong author image, but testing Wikipedia Image here.
         </p>
      </div>
   );
}
