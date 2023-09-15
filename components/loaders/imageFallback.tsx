import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

// THINK ABOUT THIS AND SEE IF THERE IS A WAY AROUND THIS
// response success; no header message difference;

// one way that i can think of is recalling the google book api
// that is calling the api again and after recalling the api
// second way is emailing the goolge team for an access to thumbnails
interface ImageFallbackProps {
  src: ImageProps["src"];
  fallbackSource: ImageProps["src"];
  alt: ImageProps["alt"];
}

export default function ImageFallback({
  src,
  fallbackSource,
  alt,
  ...rest
}: ImageFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          // Broken image
          setImgSrc(fallbackSource);
        }
      }}
      //   has to be on load?
      // onLoad={}
      //   it is not an error
      onError={() => {
        setImgSrc(fallbackSource);
      }}
    />
  );
}
