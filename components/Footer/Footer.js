import Image from "next/image";
import Link from "next/link";

import Logo from "../Logo/Logo";

import Twitter from "../../public/icon/twitter_black_icon.png";
import Medium_M from "../../public/icon/medium_black_icon.png";
import Telegram from "../../public/icon/telegram_black_icon.png";

import classes from "./Footer.module.css";

function Footer() {
  return (
    <div className={classes.Wrapper}>
      <div className={classes.Footer}>
        <div className={classes.Logo}>
          <div>
            <Link href="/">
              <a className={classes.aTag}>
                <Logo name="NameLogo" />
              </a>
            </Link>
          </div>
          <p className={classes.Copyright}>© 2021 Copyright - DreamLauncher</p>
          <p className={classes.Freepik}>
            Using some images
            <a href="https://www.freepik.com/" rel="noreferrer" target="_blank">
              Designed by Freepik
            </a>
          </p>
        </div>
        <div className={classes.List}>
          <ul className={classes.LinkList}>
            <li className={classes.LinkItem}>
              <Link href="https://docs.dreamlauncher.org/">
                <a target="_blank">About</a>
              </Link>
            </li>
            <li className={classes.LinkItem}>
              <Link href="https://docs.dreamlauncher.org/fundamentals/terms-and-conditions">
                <a target="_blank">Term</a>
              </Link>
            </li>
            <li className={classes.LinkItem}>
              <Link href="https://docs.dreamlauncher.org/fundamentals/privacy-policy">
                <a target="_blank">Privacy</a>
              </Link>
            </li>
          </ul>
          <ul className={classes.MediaList}>
            <li className={classes.MediaItem}>
              <Link href="https://twitter.com/DreamLauncher21">
                <a className={classes.aTag} target="_blank">
                  <Image
                    src={Twitter}
                    alt="Twitter"
                    width="20px"
                    height="20px"
                    className={classes.MediaImage}
                  />
                </a>
              </Link>
            </li>
            <li className={classes.MediaItem}>
              <Link href="https://t.me/joinchat/kUOk5dqsDn9jNWM9">
                <a className={classes.aTag} target="_blank">
                  <Image
                    src={Telegram}
                    alt="Telegram"
                    width="20px"
                    height="20px"
                    className={classes.MediaImage}
                  />
                </a>
              </Link>
            </li>
            <li className={classes.MediaItem}>
              <Link href="https://medium.com/@dreamlauncher.ido">
                <a className={classes.aTag} target="_blank">
                  <Image
                    src={Medium_M}
                    alt="Medium_M"
                    width="20px"
                    height="20px"
                    className={classes.MediaImage}
                  />
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Footer;
