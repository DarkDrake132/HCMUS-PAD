import Link from "next/link";
import Image from "next/image";

import classes from "./MediaLogo.module.css";

function MediaLogo(props) {
  return (
    <Link href={props.link}>
      <a className={classes.aTag} target={props.target || "_blank"}>
        <Image
          src={"/icon/" + props.icon + "_icon.png"}
          alt={props.icon}
          width="50px"
          height="50px"
        ></Image>
      </a>
    </Link>
  );
}

export default MediaLogo;
