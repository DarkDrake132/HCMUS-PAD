import React from "react";
import Image from "next/image";

const ChainLogo = (props) => {
  const strSrc = props.sm
    ? `/crypto_logos/${props.symbol}_logo_sm.svg`
    : `/crypto_logos/${props.symbol}_logo.svg`;
  return (
    <Image
      width={props.width}
      height={props.height}
      src={strSrc}
      alt={props.symbol}
    />
  );
};

export default ChainLogo;
