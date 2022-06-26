import classes from "./CurrentStake.module.css";

import Card from "../../ui/Card/Card";
import Button from "../../ui/Button/Button";
import React from "react";

const CurrentStake = (props) => {
  return (
    <Card style="WhiteBorder">
      <div className={classes.WalletInfo}>
        <div className={classes.Info}>
          <div className={classes.Wallet}>
            <h4>Validated DRE Staked</h4>
            <div className={classes.WalletToken}>
              <h2>{props.DreStaked}</h2>
              <p>DRE</p>
            </div>
            {props.closed ? (
              <React.Fragment>
                <h4>-</h4>
                <div className={classes.WalletToken}>
                  <h2>{props.WithdrawableDRE}</h2>
                  <p>DRE Withdrawable</p>
                </div>
              </React.Fragment>
            ) : null}
          </div>
          <div className={classes.PointAccumulated}>
            <h4>Point Accumulated / Max Point</h4>
            <div className={classes.Point}>
              <h2>{props.points}</h2>
              <p>pts</p>
              <h2> / {props.maxPoints}</h2>
              <p>pts</p>
            </div>
          </div>
        </div>

        <div className={classes.BuyAndWithdraw}>
          <Button
            style="DREBuyMoreBtn White Squared"
            clicked={() => {
              window.open("https://ico.dreamlauncher.org");
            }}
          >
            Buy More DRE
          </Button>
          <Button
            style="DREWithdrawBtn White Squared"
            type="button"
            clicked={() => {
              props.withdrawOnClick();
            }}
          >
            Withdraw
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CurrentStake;
