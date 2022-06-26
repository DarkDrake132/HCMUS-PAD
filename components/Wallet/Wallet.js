import React from "react";

import classes from "./Wallet.module.css";

import Logo from "../Logo/Logo";

export default function Wallet({
  walletName = "Metamask",
  width,
  height,
  clicked = () => {},
}) {
  return (
    <div
      className={classes.Wallet}
      onClick={clicked}
      style={{ cursor: "pointer" }}
    >
      <Logo name={walletName} width={width} height={height} />
    </div>
  );
}
