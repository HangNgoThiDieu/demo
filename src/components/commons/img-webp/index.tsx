import React, { useState } from "react";

const ImgOptimizeByWebp = React.memo(
  ({
    src,
    fallback,
    type,
    className,
    alt,
    ...delegated
  }: {
    src: string;
    fallback: string;
    type: string;
    className: string;
    alt?: string;
  }) => {
    const [errorSrc, setErrorSrc] = useState<any>(null);
    return (
      <picture>
        <source srcSet={errorSrc ? errorSrc : src} type={type} />
        <img
          src={fallback}
          {...delegated}
          className={className}
          loading="lazy"
          alt={alt}
          onError={() => setErrorSrc(fallback)}
        />
      </picture>
    );
  }
);

export default ImgOptimizeByWebp;
