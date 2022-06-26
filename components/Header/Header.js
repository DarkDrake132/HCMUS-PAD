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
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
      </Head>
      <div className={classes.Noti}>
        <p>
          Always make sure the URL is <b>app.dreamlauncher.org</b> - bookmark it
          to be safe.
        </p>
      </div>
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
          <Link href="/">
            <a className={classes.aTag}>
              <Logo name="DLFullnameLogo" />
            </a>
          </Link>
        </div>
        {/* Mobile logo */}
        <div className={classes.MobileLogo}>
          <Link href="/">
            <a className={classes.aTag}>
              <Logo name="DreamLauncher" width="50px" height="80px" />
            </a>
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
                  <div className={classes.ChainIcon}>
                    <Image
                      src={`/icon/${networkChain.chainName}_icon.png`}
                      alt="network"
                      width="30px"
                      height="30px"
                    />
                  </div>
                  <p className={classes.Balance}>
                    {roundUp(balance)} {networkChain.chainName}
                  </p>
                </div>
                {/* Tooltip goes here */}
                <Tooltip tooltipText={tooltipText}>
                  <p className={classes.WalletAddress}>
                    {walletAddress.slice(0, 6)}...
                    {walletAddress.slice(
                      walletAddress.length - 4,
                      walletAddress.length
                    )}{" "}
                  </p>
                  <span className={"material-icons " + classes.CopyIcon}>
                    content_copy
                  </span>
                </Tooltip>
              </div>
            ) : (
              <div className={classes.ConnectWallet}>
                <Button
                  style="ConnectWallet Squared"
                  clicked={handleConnectWalletClick}
                >
                  Connect Wallet
                </Button>
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
