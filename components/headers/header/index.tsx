import Head from 'next/head';

export type MetaTag = {
    name?: string;
    property?: string;
    content: string;
    key?: string;
  };

interface NextHeadProps {
    title: string;
    metaTags: MetaTag[];
}


const NextHead = (props: NextHeadProps) => {
    return (
        <Head>
            <title>{props.title}</title>
            {props.metaTags.map((tag, index) => (
        <meta
          key={tag.key || `meta-${index}`}
          name={tag.name}
          property={tag.property}
          content={tag.content}
        />
      ))}
        </Head>
    )
}

export default NextHead;