import React, { useEffect, useState } from "react";
import NoImage from "assets/images/no-image.png";

const Image: React.FC<{
  src: string;
  alt?: string;
  className?: string;
  isBase64?: boolean;
  styleCustom?: any;
}> = (props) => {
  const [errorSrc, setErrorSrc] = useState<any>(null);

  useEffect(() => {
    if (!props.src) {
      onError();
    } else {
      setErrorSrc(null);
    }
  }, [props.src]);

  const onError = () => {
    setErrorSrc(NoImage);
  };

  return (
    <img
      loading="lazy"
      style={props.styleCustom}
      src={errorSrc ? errorSrc : props.isBase64 ? props.src : `${props.src}`}
      alt={props.alt || ""}
      className={props.className}
      onError={onError}
    />
  );
};

export default Image;
