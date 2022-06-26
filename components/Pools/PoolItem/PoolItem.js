import React from "react";

import Image from "next/image";
import Card from "../../ui/Card/Card";
import classes from "./PoolItem.module.css";
import { useRouter } from "next/router";

//util

import { getRemainingTimeString } from "../../../utility/DateUtility";
import { roundUp, numberFormatter } from "../../../utility/NumberUtility";

const PoolItem = (props) => {
  const router = useRouter();

  let poolStatus;
  if (props.status == "upcoming") {
    poolStatus = (
      <div className={classes.UpComing}>
        {getRemainingTimeString(props.beginTime)}
      </div>
    );
  } else {
    poolStatus = (
      <div className={classes.ProgressDetail}>
        <h4>Progress</h4>
        <div className={classes.ProgressBar}>
          <meter
            className={classes.Meter}
            min="0"
            max="100"
            value={roundUp((props.soldAmount / props.tokenAmount) * 100, 2)}
          ></meter>
        </div>
        <div className={classes.ProgressInfor}>
          <p className={classes.ProgressPercent}>
            {roundUp((props.soldAmount / props.tokenAmount) * 100, 2)}%
          </p>
          <p>
            {roundUp(props.soldAmount)}/{roundUp(props.tokenAmount)}
          </p>
        </div>
      </div>
    );
  }
  /*
    Routing to the pool detail
  */
  const redirectToPoolDetail = () => {
    router.push(`/${props.id}`);
    // if(props.status === "upcoming") {
    //   window.open(props.website)
    // }
    // else {
    //   router.push(`/${props.id}`);
    // }
  };

  let CardStyle = "HoverBounce";
  if (props.status === "ended") {
    CardStyle += " WhiteBorder";
  }


  const totalRaiseDisplay =
    props.totalRaise > 1
      ? numberFormatter(roundUp(props.totalRaise, 1))
      : roundUp(props.totalRaise);
  const tokenAmountDisplay =
    props.tokenAmount > 1
      ? numberFormatter(roundUp(props.tokenAmount, 1))
      : roundUp(props.tokenAmount);

  return (
    <li className={classes.Item} onClick={redirectToPoolDetail}>
      <Card style={CardStyle}>
        <div className={classes.PoolCard}>
          <div className={classes.Image}>
            <Image
              src={props.imgSrc}
              width={150}
              height={150}
              alt={props.name}
            />
          </div>
          <div className={classes.Informations}>
            <div className={classes.PoolName}>
              <h2>{props.name}</h2>
            </div>

            {poolStatus}

            <div className={classes.Detail}>
              <div className={classes.DetailItem}>
                <p>Total Raise</p>
                <h3 className={classes.PrimaryHighlighted}>
                  {totalRaiseDisplay + " " + props.chainName}
                </h3>
              </div>
              <div className={classes.DetailItem}>
                <p>Total Token</p>
                <h3 className={classes.SecondaryHighlighted}>
                  {
                    /*Check if the pool is upcoming type*/
                    props.status !== "upcoming"
                      ? tokenAmountDisplay
                      : "TBA"
                  }
                </h3>
              </div>
              <div className={classes.DetailItem}>
                <p>Participants</p>
                <h3 className={classes.SecondaryHighlighted}>
                  {
                    /*Check if the pool is upcoming type*/
                    props.status !== "upcoming" ? props.participants : "TBA"
                  }
                </h3>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </li>
  );
};

export default PoolItem;
