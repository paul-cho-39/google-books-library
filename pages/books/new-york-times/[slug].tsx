import { GetStaticPaths, GetStaticProps, InferGetServerSidePropsType } from 'next';

export default function BookNytPage(props: InferGetServerSidePropsType<typeof getStaticProps>) {}

export const getStaticPaths: GetStaticPaths = async () => {
   const paths = {};

   return {
      paths,
      fallback: true,
   };
};

export const getStaticProps: GetStaticProps<{}> = async () => {
   return {};
};
