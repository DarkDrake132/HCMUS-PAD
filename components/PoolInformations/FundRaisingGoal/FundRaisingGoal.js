import React, { useEffect, useState } from "react";
import Card from "../../ui/Card/Card";

import { useRouter } from "next/router";

import { isTimePassed, calculateTimeLeft } from "../../../utility/DateUtility";

import Button from "../../ui/Button/Button";
import classes from "./FundRaisingGoal.module.css";

//Upcoming
const Upcoming = (props) => {
  return (
    <React.Fragment>
      {/* <div className={classes.Information}>
        <p className={classes.Label}>Some Info</p>
        <p className={classes.Value}>Some Value</p>
      </div>
      <div className={classes.Information}>
        <p className={classes.Label}>Some Info</p>
        <p className={classes.Value}>Some Value</p>
      </div> */}
      <div className={classes.Button}>
        <Button
          style="White Gray-Ring GetWhitelistBtn"
          clicked={() => {
            window.open(
              "https://docs.dreamlauncher.org/guides/how-to-join-the-whitelist-in-the-public-pool"
            );
          }}
        >
          How to join whitelist ?
        </Button>
      </div>
    </React.Fragment>
  );
};

//whitelist open
const WhitelistOpen = (props) => {
  return (
    <React.Fragment>
      <div className={classes.Information}>
        <p className={classes.Value}>
          Whitelist for {props.poolName} is now opening
        </p>
      </div>
      <div className={classes.Button}>
        <Button
          style="ApplyWhitelistBtn"
          clicked={() => {
            window.open(props.whitelistLink);
          }}
        >
          Apply for whitelist
        </Button>
      </div>
    </React.Fragment>
  );
};

const FundRaisingGoal = (props) => {
  const router = useRouter();
  const isWhitelistOpen =
    isTimePassed(props.whitelistBegin) && !isTimePassed(props.whitelistEnd);

  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(isWhitelistOpen ? props.whitelistEnd : props.beginTime)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(
        calculateTimeLeft(
          isWhitelistOpen ? props.whitelistEnd : props.beginTime
        )
      );
    }, 1000);
    if (timeLeft <= 0) {
      router.reload();
    }
    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    let time = timeLeft[interval];
    if (timeLeft[interval] < 10) {
      time = "0" + timeLeft[interval];
    }

    timerComponents.push(
      <div suppressContentEditableWarning className={classes.TimeValue}>
        <p>{time}</p>
      </div>
    );
  });

  return (
    <Card>
      <div className={classes.TokenCard}>
        <div className={classes.TokenInfo}>
          <div className={classes.Title}>
            <h3>fundraising goal</h3>
          </div>
          <div className={classes.Title}>
            <h1>
              {props.moneyRaise.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </h1>
          </div>
        </div>
        {isWhitelistOpen ? (
          <WhitelistOpen
            poolName={props.poolName}
            whitelistLink={props.whitelistLink}
          />
        ) : (
          <Upcoming beginTime={props.beginTime} endTime={props.endTime} />
        )}

        <div className={classes.Title}>
          <p>
            {!props.isKYC ? (
              <i className={classes.Warning}>
                You need to do KYC in order to join whitelist!
              </i>
            ) : (
              <i className={classes.Success}>Your wallet is already got KYC!</i>
            )}
          </p>
        </div>

        <div className={classes.CountdownCard}>
          <h4 className={classes.CountdownTitle} data-countdown-target="prefix">
            {isWhitelistOpen ? "Whitelist Ends In" : "IDO Starts In"}
          </h4>
          <div className={classes.TimeCard}>
            <div className={classes.TimeInterval}>
              {timerComponents[0]}
              <span>Days</span>
            </div>
            <div className={classes.Colon}>:</div>
            <div className={classes.TimeInterval}>
              {timerComponents[1]}
              <span>Hours</span>
            </div>
            <div className={classes.Colon}>:</div>
            <div className={classes.TimeInterval}>
              {timerComponents[2]}
              <span>Minutes</span>
            </div>
            <div className={classes.Colon}>:</div>
            <div className={classes.TimeInterval}>
              {timerComponents[3]}
              <span>Seconds</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FundRaisingGoal;
