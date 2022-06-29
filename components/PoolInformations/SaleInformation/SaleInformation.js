import React from "react";
import Card from "../../ui/Card/Card";
import Tooltip from "../../ui/Tooltip/Tooltip";

import { roundUp } from "../../../utility/NumberUtility";

import classes from "./SaleInformation.module.css";

const SaleInformation = (props) => {
  //console.log(props);
  const token = props.pool.tokenInformations;
  const progress = props.pool.saleInformations;
  const formatPropName = (propName) => {
    switch (propName) {
      case "name":
        return "Name";
      case "address":
        return "Address";
      case "decimals":
        return "Decimals";
      case "swapValue":
        return "Swap Value";
      case "totalSupply":
        return "Total Supply";
      case "tokenForSale":
        return "Token For Sale";
      case "symbol":
        return "Symbol";
      default:
        return propName;
    }
  };
  const displayPropValue = (propName) => {
    if (!propName) return "";
    switch (propName) {
      case "address":
        return token[propName];
      case "totalSupply":
        return roundUp(token[propName]).toString();
      case "swapValue":
        return props.chainName;
      default:
        return token[propName];
    }
  };

  const informations = Object.keys(token).map((propName, index) => {
    if (propName !== "id") {
      return (
        <div className={classes.Information} key={index}>
          <p className={classes.Label}>{formatPropName(propName)}</p>
          <p className={classes.Value}>{displayPropValue(propName)}</p>
        </div>
      );
    }
  });
  return (
    <Card>
      <div className={classes.TokenCard}>
        <div>
          <div className={classes.Title}>
            <h3 style={{ textTransform: "none" }}>Sale Information</h3>
          </div>
          <div>{informations}</div>
        </div>
        {/*Progress Bar */}
        <div className={classes.ProgressSection}>
          <div className={classes.ProgressTime}>
            <div className={classes.StartDate}>
              <p>Start Date</p>
              <p>{new Date(progress.beginTime * 1000).toUTCString()}</p>
            </div>
            <div className={classes.EndDate}>
              <p>End Date</p>
              <p>{new Date(progress.endTime * 1000).toUTCString()}</p>
            </div>
          </div>
          <div className={classes.ProgressBar}>
            <meter
              className={classes.Meter}
              min="0"
              max="100"
              value={roundUp(
                (progress.saledTokenAmount / progress.tokenForSale) * 100
              ).toString()}
            ></meter>
          </div>
          <div className={classes.ProgressInfor}>
            <p>
              Current: {roundUp(progress.saledTokenAmount)} (
              {roundUp(
                (progress.saledTokenAmount / progress.tokenForSale) * 100
              )}
              %)
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SaleInformation;
