import React from "react";
import Button from "../../ui/Button/Button";
import Card from "../../ui/Card/Card";
import classes from "./PoolInformation.module.css";

// MUI COMPONENTS
import MuiButton from "@mui/material/Button";

const PoolInformation = (props) => {
  const pool = props.pool;
  const tokenSymbol = props.tokenSymbol;
  const formatPropName = (propName) => {
    switch (propName) {
      case "poolName":
        return "Name";
      case "moneyRaise":
        return "Money Raise ($)";
      case "TokenRaise":
        return "Total Token";
      case "participants":
        return "Participants";
      case "minAllocation":
        return `Min ${tokenSymbol}   Allocation`;
      case "maxAllocation":
        return `Max ${tokenSymbol} Allocation`;
      case "whitelist":
        return "Whitelist";
    }
  };
  const informations = Object.keys(pool).map((propName, index) => {
    if (propName !== "id") {
      return (
        <div className={classes.Information} key={index}>
          <p className={classes.Label}>{formatPropName(propName)}</p>
          {/*if propName == whitelist display whitelist status else display normal informations */}
          {propName == "whitelist" ? (
            pool[propName] ? (
              <p className={classes.Whitelist}>Your wallet is whitelisted</p>
            ) : (
              // eslint-disable-next-line react/no-unescaped-entities
              <p className={classes.NotWhitelist}>
                Your wallet is not whitelisted
              </p>
            )
          ) : (
            <p className={classes.Value}>{pool[propName]}</p>
          )}
        </div>
      );
    }
  });
  return (
    <Card>
      <div className={classes.PoolCard}>
        <div>
          <div className={classes.Title}>
            <h3 style={{ textTransform: "none" }}>Pool Information</h3>
          </div>
          <div>{informations}</div>
        </div>
        <div className={classes.Button}>
          <MuiButton
            variant="contained"
            disabled={props.loading || !props.joinable}
            onClick={props.joinPoolHandler}
          >
            Join Pool
          </MuiButton>
        </div>
      </div>
    </Card>
  );
};
export default PoolInformation;
