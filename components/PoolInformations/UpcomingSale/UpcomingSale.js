import React from "react";
import Card from "../../ui/Card/Card";

import { isTimePassed } from "../../../utility/DateUtility";

import classes from "./UpcomingSale.module.css";

const UpcomingSale = (props) => {
  const isWhitelistOpen =
    isTimePassed(props.whitelistBegin) && !isTimePassed(props.whitelistEnd);

  const isWhitelistEnd = isTimePassed(props.whitelistEnd);
  return (
    <Card>
      <div className={classes.TokenCard}>
        <div>
          <div className={classes.Title}>
            <h3 style={{ textTransform: "none" }}>Sale Information</h3>
          </div>
          <div>
            <div className={classes.Information}>
              <p className={classes.Label}>Name</p>
              <p className={classes.Value}>{props.name}</p>
            </div>
            <div className={classes.Information}>
              <p className={classes.Label}>Sale Start Time</p>
              <p className={classes.Value}>
                {props.beginTime
                  ? new Date(props.beginTime * 1000).toLocaleString()
                  : "TBA"}
              </p>
            </div>
            <div className={classes.Information}>
              <p className={classes.Label}>Sale End Time</p>
              <p className={classes.Value}>
                {props.endTime
                  ? new Date(props.endTime * 1000).toLocaleString()
                  : "TBA"}
              </p>
            </div>
            <div className={classes.Information}>
              <p className={classes.Label}>Token Release Time</p>
              <p className={classes.Value}>
                {props.endTime
                  ? new Date(props.endTime * 1000).toLocaleString()
                  : "TBA"}
              </p>
            </div>
            <div className={classes.Information}>
              <p className={classes.Label}>Status</p>
              <p className={classes.Status}>
                {isWhitelistOpen
                  ? "Whitelist Open"
                  : isWhitelistEnd
                  ? "Whitelist End"
                  : "Whitelist Soon"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpcomingSale;
