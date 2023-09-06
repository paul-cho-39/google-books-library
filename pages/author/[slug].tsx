import { InferGetServerSidePropsType, InferGetStaticPropsType } from 'next';
import googleApi, { fetcher } from '../../lib/helper/books/fetchGoogleUrl';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import doFetch from '../../lib/helper/books/fetchWikiUrl';
import Image from 'next/image';
import { useEffect } from 'react';

// find ways to sort the author:
// 1) have users report when the image is incorrect*
// 2) manually input names that should HAVE second index in the array
// 3) come up with extensive lists or keywords that can satisfy MOST filters

export default function Author({}) {
   // console.log(props);
   const router = useRouter();
   const { slug } = router.query;
   const { data: authors } = useQuery(['getauthors', { slug }], () =>
      fetcher(googleApi.getUrlByAuthor(slug as string))
   );
   const { data: example } = useQuery([`irrelvant`, { slug }], () => doFetch(slug as string));
   console.log(authors);

   useEffect(() => {
      if (!router.isReady) return;
      console.log(authors);
   }, [router.isReady]);
   // the wikipage is the primary for now, but have to hold onto this page
   // need to find a way to filter an author

   //

   // is there a method to skip out on the details?
   // too much information and cannot skim through all of them
   // includes const descriptors = ["journalist", "writer", "historian", "novelist", "author"];
   const getThumbnail = () => {
      const thumbnail = example && example?.pages.map((page) => page.thumbnail)[0];
      const thumbnailUrl = thumbnail && thumbnail.url.toString();
      const replacedThumbnail = thumbnailUrl && thumbnailUrl.replace('/60px', '/240px');
      return thumbnail ? 'https:' + replacedThumbnail : '/unavailableThumbnail.png';
   };

   // console.log(getThumbnail());

   // console.log(authors);
   return (
      <div>
         <h2>Testing Images</h2>
         <Image src={getThumbnail()} alt='Jupiter' width={360} height={300} />
      </div>
   );
}

// should it be getStaticSideProps?

// export const getServerSideProps = async (context: any) => {
//   const query = context.params.query;
//   return {
//     props: { query: JSON.parse(context) },
//   };
//   // get book that starts with this authors name
//   // get context.query? and use this to retrieve the data
// };

// 1) do i need userId?
// a) yes
// 2) what kind of data will i be using?
// a) amount of time spent on this author? rating of the author? general content (catgs)?
// b)
