import React, { useState } from "react";

import Image from "next/image";

import Card from "../../ui/Card/Card";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";

//utilities
import { roundUp } from "../../../utility/NumberUtility";

import classes from "./StakeToken.module.css";

const StakeToken = (props) => {
  return (
    <Card>
      <form onSubmit={props.submitHandler} className={classes.SwapToken}>
        <div className={classes.Title}>
          <h3>stake token</h3>
        </div>
        <div className={classes.InputSection}>
          <div className={classes.InputLabel}>
            <div className={classes.MaxDiv}>
              <p className={classes.BoldLabel}>Amount</p>
            </div>
            <p className={classes.LightLabel}>
              Balance:{" "}
              {props.accountBalance ? roundUp(props.accountBalance) : "0"} DRE
            </p>
          </div>
          {/*Remember to give input some style classes like Prototype */}
          <div className={classes.SwapInput}>
            <Input
              type="number"
              style="Swap NoBorder"
              value={props.value ? props.value : "0"}
              changed={(e) => {
                props.changeHandler(e);
              }}
              placeholder={props.value}
              disabled={props.closed}
            ></Input>
            <div className={classes.RightInput}>
              <Button
                style="Primary Ring Rounded MaxBtn"
                clicked={props.maxHandler}
                disabled={props.closed}
              >
                MAX
              </Button>
              <Image
                alt="DRE"
                width="80px"
                height="70%"
                src={`/crypto_logos/DRE_logo_sm.svg`}
              />
            </div>
          </div>
        </div>
        <Button
          style="StakeBtn Big Squared SwapBtn"
          loading={props.loading}
          disabled={props.loading || props.closed}
          type="submit"
        >
          {props.loading ? "Staking" : "Stake"}
        </Button>
      </form>
    </Card>
  );
};

export default StakeToken;
