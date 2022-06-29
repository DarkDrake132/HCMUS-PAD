import React, { useState } from "react";

import Card from "../../ui/Card/Card";
import Button from "../../ui/Button/Button";
import Input from "../../ui/Input/Input";

//utilities
import { roundUp } from "../../../utility/NumberUtility";

import classes from "./SwapTokenPopUp.module.css";

// MUI COMPONENTS
import MuiButton from "@mui/material/Button";

const SwapTokenPopUp = (props) => {
  return (
    <div style={{ background: "#0A1929" }}>
      <Card>
        <div className={classes.SwapToken}>
          <div className={classes.Title}>
            <h3 style={{ textTransform: "none" }}>Swap Token</h3>
          </div>
          <div>
            <div className={classes.InputInformation}>
              <div className={classes.MaxDiv}>
                <p className={classes.BoldLabel}>From</p>
              </div>
              <p className={classes.LightLabel}>
                Balance: {props.accountBalance} {props.chainName}
              </p>
            </div>
            {/*Remember to give input some style classes like Prototype */}
            <div className={classes.SwapInput}>
              <Input
                style="Swap NoBorder"
                value={props.value}
                changed={(e) => {
                  props.changeHandler(e);
                }}
                placeholder={props.minAllocation}
              ></Input>
              <MuiButton
                variant="contained"
                sx={{ alignSelf: "center", mx: 0.5 }}
                onClick={props.maxHandler}
              >
                Max
              </MuiButton>
            </div>
          </div>
          <div>
            <div className={classes.InputInformation}>
              <p className={classes.BoldLabel}>To</p>
              <p className={classes.LightLabel}>
                Remaining: {roundUp(props.accountBalance - props.value)}{" "}
                {props.chainName}
              </p>
            </div>
            <Input
              style="Swap NoClick"
              value={roundUp(props.value / props.swapValue)}
              changed={() => {}}
              placeholder="0.0"
            ></Input>
          </div>
          <div className={classes.MaxAllocation}>
            <p className={classes.BoldLabel}>
              Min Allocation: {props.minAllocation} {props.chainName}
            </p>
          </div>
          <div className={classes.MaxAllocation}>
            <p className={classes.BoldLabel}>
              Max Allocation Available: {props.maxAllocation} {props.chainName}
            </p>
          </div>
          <MuiButton
            fullWidth
            variant="contained"
            type="submit"
            disabled={props.loading}
          >
            {props.loading ? "Swapping" : "Swap"}
          </MuiButton>
          <div className={classes.SwapValue}>
            <p className={classes.LightLabel}>Swap Value:</p>
            <p className={classes.BoldLabel}>
              1 {props.symbol} = {props.swapValue} {props.chainName}
            </p>
          </div>
          <div className={classes.SwapValue}>
            <p className={classes.LightLabel}>Estimate Gas Price:</p>
            <p className={classes.BoldLabel}>
              {props.gasPrice} {props.chainName}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SwapTokenPopUp;
