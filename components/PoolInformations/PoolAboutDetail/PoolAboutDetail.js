import Link from "next/link";
import React, { Fragment } from "react";

import Card from "../../ui/Card/Card.js";

import classes from "../PoolAboutDetail/PoolAboutDetail.module.css";

function PoolAboutDetail(props) {
  const aboutInfo = props.aboutInfo;
  return (
    <Fragment>
      <div className={classes.Website}>
        <h4 style={{ marginRight: 8 }}>Website :</h4>
        <Link href={aboutInfo.website}>
          <a target="blank" className={classes.aTag}>
            {aboutInfo.website}
          </a>
        </Link>
      </div>
      <p
        className={classes.Description}
        dangerouslySetInnerHTML={{ __html: aboutInfo.description }}
      />
    </Fragment>
  );
}

export default PoolAboutDetail;
