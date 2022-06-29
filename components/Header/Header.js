//import from next
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

//import component
import React, { useState, useContext } from "react";

import { WalletContext } from "../../context/WalletContext";
import { NotificationContext } from "../../context/NotificationContext";

import Wallet from "../Wallet/Wallet";
import Logo from "../Logo/Logo";
import Navbar from "../Navigation/Navbar/Navbar";
import Button from "../ui/Button/Button";
import Modal from "../ui/Modal/Modal";
import Tooltip from "../ui/Tooltip/Tooltip";
import NavLink from "../ui/NavLink/NavLink";
//import module css
import classes from "./Header.module.css";

import { roundUp } from "../../utility/NumberUtility";

// MUI COMPONENTS
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

// MUI ICONS
import RocketIcon from "@mui/icons-material/Rocket";

// MUI COMPONENTS
import MuiButton from "@mui/material/Button";

export const EthereumLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlnsxodm="http://www.corel.com/coreldraw/odm/2003"
      xmlSpace="preserve"
      width="100%"
      height="100%"
      version="1.1"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 784.37 1277.39"
      wtx-context="658C775D-6C5A-4F89-806E-C96F7873BA3A"
    >
      <g id="Layer_x0020_1">
        <metadata id="CorelCorpID_0Corel-Layer" />
        <g id="_1421394342400">
          <g>
            <polygon
              fill="#343434"
              fillRule="nonzero"
              points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "
            />
            <polygon
              fill="#8C8C8C"
              fillRule="nonzero"
              points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "
            />
            <polygon
              fill="#3C3C3B"
              fillRule="nonzero"
              points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "
            />
            <polygon
              fill="#8C8C8C"
              fillRule="nonzero"
              points="392.07,1277.38 392.07,956.52 -0,724.89 "
            />
            <polygon
              fill="#141414"
              fillRule="nonzero"
              points="392.07,882.29 784.13,650.54 392.07,472.33 "
            />
            <polygon
              fill="#393939"
              fillRule="nonzero"
              points="0,650.54 392.07,882.29 392.07,472.33 "
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

function Header() {
  const {
    wallets,
    walletAddress,
    setAccountAndChainId,
    networkChain,
    balance,
    connectWallet,
    walletsModal,
    setWalletsModal,
    connectWalletByType,
  } = useContext(WalletContext);

  const DEFAULT_AUTO_CLOSE_TIME = 5000;

  const { notification, setNotification, notiUtils } =
    useContext(NotificationContext);

  // style classes for open close menu
  const menuClosedClass = classes.MenuClosed;
  const menuOpenedClass = classes.MenuOpened;

  const [menuClasses, setMenuClasses] = useState(menuClosedClass);
  const [tooltipText, setTooltipText] = useState("Click to copy");

  async function handleConnectWalletClick() {
    await connectWallet();
  }

  const handleMenuToggle = () => {
    let newMenuClasses = menuOpenedClass;
    if (menuClasses.includes(menuOpenedClass)) {
      newMenuClasses = menuClosedClass;
    }

    setMenuClasses(newMenuClasses);
  };

  const copyToClipboardHandler = () => {
    navigator.clipboard.writeText(walletAddress);
    setTooltipText("Copied!");
    const timer = setTimeout(() => {
      setTooltipText("Click to copy");
    }, 3000);
    return () => clearTimeout(timer);
  };

  return (
    <div className={classes.Wrapper}>
      {/* Temporary notification  */}
      <Head>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png?" />
      </Head>
      <div className={classes.Header}>
        {/* Modal for choosing wallet */}
        <Modal
          show={walletsModal}
          modalClosed={() => {
            setWalletsModal(false);
          }}
          hasBackdrop={true}
        >
          <div className={classes.WalletsModal}>
            <h3>Connect Wallet</h3>
            {wallets.map((wallet) => {
              return (
                <Wallet
                  key={wallet.type}
                  walletName={wallet.imageName}
                  clicked={async () => {
                    try {
                      await connectWalletByType(wallet.type);
                      if (wallet.type === "wallet-connect") {
                        setAccountAndChainId();
                      }
                      setWalletsModal(false);
                    } catch (err) {
                      setWalletsModal(false);
                      if (err.code == -32002) {
                        setNotification({
                          fixed: false,
                          type: notiUtils.DANGER,
                          message: notiUtils.OPEN_MANUALLY,
                        });
                      } else {
                        setNotification({
                          fixed: false,
                          type: notiUtils.DANGER,
                          message: err.message,
                          autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
                        });
                      }
                    }
                  }}
                />
              );
            })}
          </div>
        </Modal>

        {/* Desktop logo */}
        <div className={classes.Logo}>
          <Link href="/" passHref>
            <Toolbar sx={{ cursor: "pointer" }}>
              <RocketIcon fontSize="large" />
              <Typography variant="h3">HCMUSPad</Typography>
            </Toolbar>
          </Link>
        </div>
        {/* Mobile logo */}
        <div className={classes.MobileLogo}>
          <Link href="/" passHref>
            <div style={{ width: 40, height: 40 }}>
              <RocketIcon fontSize="large" sx={{ mt: 2, cursor: "pointer" }} />
            </div>
          </Link>
        </div>

        <div className={classes.NavBar}>
          <Navbar onClick={() => console.log("close")} />
          {
            /* style the wallet address here */
            walletAddress ? (
              <div className={classes.Wallet} onClick={copyToClipboardHandler}>
                {/* ChainName and Balance */}
                <div>
                  <div
                    className={classes.ChainIcon}
                    style={{ width: 40, height: 40 }}
                  >
                    <EthereumLogo />
                  </div>
                  <p className={classes.Balance} style={{ color: "white" }}>
                    {roundUp(balance)} {networkChain.chainName}
                  </p>
                </div>
                {/* Tooltip goes here */}
                <Tooltip tooltipText={tooltipText}>
                  <p
                    className={classes.WalletAddress}
                    style={{ color: "white" }}
                  >
                    {walletAddress.slice(0, 6)}...
                    {walletAddress.slice(
                      walletAddress.length - 4,
                      walletAddress.length
                    )}{" "}
                  </p>
                  <span
                    className={"material-icons " + classes.CopyIcon}
                    style={{ color: "white" }}
                  >
                    content_copy
                  </span>
                </Tooltip>
              </div>
            ) : (
              <div className={classes.ConnectWallet}>
                <MuiButton
                  variant="contained"
                  size="large"
                  sx={{ alignSelf: "center" }}
                  onClick={handleConnectWalletClick}
                >
                  Connect Wallet
                </MuiButton>
              </div>
            )
          }
          <div className={classes.Menu} onClick={handleMenuToggle}>
            <Image
              src={`/icon/menu_icon.svg`}
              alt="menu"
              width="30px"
              height="30px"
            />
          </div>
        </div>
      </div>
      <div className={menuClasses}>
        <nav className={classes.Nav}>
          <ul className={classes.NavList}>
            <li className={classes.NavItem}>
              <NavLink href="/pools">
                <div className={classes.NavLink} onClick={handleMenuToggle}>
                  <a className={classes.aTag}>Pools</a>
                </div>
              </NavLink>
            </li>
            <li className={classes.NavItem}>
              <NavLink href="/account">
                <div className={classes.NavLink} onClick={handleMenuToggle}>
                  <a className={classes.aTag}>Account</a>
                </div>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;
