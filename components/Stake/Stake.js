import { useState, useEffect, useContext } from "react";

import { WalletContext } from "../../context/WalletContext.js";
import { NotificationContext } from "../../context/NotificationContext.js";

import StakeToken from "./StakeToken/StakeToken";
import CurrentStake from "./CurrentStake/CurrentStake";

import classes from "./Stake.module.css";

// Component
import Modal from "../../components/ui/Modal/Modal";
import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import Tooltip from "../../components/ui/Tooltip/Tooltip";

//utilities
import { isTimePassed } from "../../utility/DateUtility.js";

//contract
import { getDREBalance } from "../../contract/services/client/erc20";
import {
  stake,
  withdraw,
  withdrawAll,
  getStakerInfo,
  getWithdrawMaxAmount,
  getUnlockTime
} from "../../contract/services/client/stake";

function WithdrawPopUp(props) {
  const [value, setValue] = useState(props.value);

  const changeHandler = (e) => {
    let value = e.target.value;
    if (parseFloat(value) > props.maxWithdrawAvailable) {
      setValue(props.maxWithdrawAvailable);
    } else {
      setValue(value);
    }
  };

  return (
    <Card style="Tertiary">
      <div className={classes.EditPopup}>
        <h3>Withdraw Staked Token</h3>

        <div className={classes.SwapInput}>
          <Input
            style="Swap NoBorder"
            type="number"
            value={value}
            changed={changeHandler}
          ></Input>
          <div className={classes.RightInput}>
            <Tooltip
              tooltipText={"Withdraw " + props.maxWithdrawAvailable + " DRE"}
            >
              <Button
                style="Primary Ring Rounded MaxBtn"
                clicked={() => props.withdrawAll()}
              >
                MAX
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className={classes.WithdrawButton}>
          <Button
            loading={props.withdrawing}
            disabled={props.withdrawing}
            style="SubmitEditPoolBtn"
            type="submit"
            clicked={() => props.submitHandler(value)}
          >
            Withdraw
          </Button>
        </div>
      </div>
    </Card>
  );
}

const Stake = (props) => {
  const DEFAULT_AUTO_CLOSE_TIME = 5000;
  const { walletAddress, balance } = useContext(WalletContext);
  const { notification, setNotification, notiUtils } =
    useContext(NotificationContext);

  const [DREbalance, setDREbalance] = useState(0);
  //stake
  const [stakeValue, setStakeValue] = useState(0);
  const [staking, setStaking] = useState(false);
  const [stakingInfo, setStakingInfo] = useState({
    amount: 0,
    point: 0,
    maxPoint: 0,
  });
  //withdraw
  const [withdrawValue, setWithdrawValue] = useState(0);
  const [isWithdrawPopUp, setIsWithdrawPopUp] = useState(false);
  const [maxWithdrawAvailable, setMaxWithdrawAvailable] = useState(0);
  const [withdrawing, setWithdrawing] = useState(false);

  //reload
  const [reload, setReload] = useState(true);

  //end ?
  const isStakeEnd = isTimePassed(props.whitelistEnd);

  useEffect(() => {
    if (walletAddress) {
      getDREBalance(walletAddress).then((dreBalance) => {
        setDREbalance(dreBalance);
      });
      if (props.stakeAddress) {
        getStakerInfo(props.stakeAddress).then((info) => {
          setStakingInfo({
            ...info,
          });
        });
        getWithdrawMaxAmount(props.stakeAddress, walletAddress).then((max) => {
          setMaxWithdrawAvailable(max);
        });
      }
    }
  }, [walletAddress, reload]);

  const maxButtonClicked = () => {
    setStakeValue(DREbalance);
  };

  const onStakeValueChange = (e) => {
    const input = e.target.value;
    //if user attemp to allocate more than maxAllocation, set it to maxAllocation
    if (parseFloat(input) > DREbalance) {
      maxButtonClicked();
    } else {
      setStakeValue(input);
    }
  };

  const validateStakeValue = (value) => {
    if (parseFloat(value) <= 0) {
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.WARNING,
        message: notiUtils.DATA_GREATER_ZERO,
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
      return false;
    }
    return true;
  };

  const stakeSubmitHandler = async (e) => {
    e.preventDefault();
    setStaking(true);
    //Loading
    setNotification((prevState) => ({
      ...prevState,
      type: notiUtils.PROCESSING,
      message: notiUtils.PLEASE_WAIT,
      autoCloseTime: "",
    }));
    if (validateStakeValue(stakeValue)) {
      try {
        const res = await stake(props.stakeAddress, stakeValue);
        if (res) {
          //success
          setNotification((prevState) => ({
            ...prevState,
            type: notiUtils.SUCCESS,
            message: stakeValue + " Token Staked Successfully!",
            autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
          }));
        } else {
          //fail
          setNotification((prevState) => ({
            ...prevState,
            type: notiUtils.DANGER,
            message: "Fail to stake " + stakeValue + " token! Try Again!",
            autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
          }));
        }
      } catch (err) {
        //failt
        setNotification((prevState) => ({
          ...prevState,
          type: notiUtils.DANGER,
          message: err.message,
          autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
        }));
      }
    }

    setStaking(false);
    setReload(!reload);
  };

  const validateWithdrawValue = (value) => {
    if (parseFloat(value) <= 0) {
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.DANGER,
        message: notiUtils.DATA_GREATER_ZERO,
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
      return false;
    }
    if (parseFloat(value) > stakingInfo.amount) {
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.DANGER,
        message: notiUtils.DATA_LESS_MAX,
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
      return false;
    }
    return true;
  };

  const withdrawHandler = async (value) => {
    setWithdrawing(true);
    //Loading
    setNotification((prevState) => ({
      ...prevState,
      type: notiUtils.PROCESSING,
      message: notiUtils.PLEASE_WAIT,
      autoCloseTime: "",
    }));

    if (validateWithdrawValue(value)) {
      try {
        console.log("Withdraw", value);
        const res = await withdraw(props.stakeAddress, value);
        if (res) {
          //success
          setNotification((prevState) => ({
            ...prevState,
            type: notiUtils.SUCCESS,
            message: value + " Token Withdrawed Successfully!",
            autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
          }));
        } else {
          //fail
          setNotification((prevState) => ({
            ...prevState,
            type: notiUtils.DANGER,
            message: "Fail to Withdraw " + value + " token! Try Again!",
            autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
          }));
        }
      } catch (err) {
        //fail
        setNotification((prevState) => ({
          ...prevState,
          type: notiUtils.DANGER,
          message: err.message,
          autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
        }));
      }
    }
    setWithdrawing(false);
    setReload(!reload);
  };

  const withdrawAllHandler = async () => {
    setWithdrawing(true);
    //Loading
    setNotification((prevState) => ({
      ...prevState,
      type: notiUtils.PROCESSING,
      message: notiUtils.PLEASE_WAIT,
      autoCloseTime: "",
    }));
    try {
      const res = await withdrawAll(props.stakeAddress);
      if (res) {
        //success
        setNotification((prevState) => ({
          ...prevState,
          type: notiUtils.SUCCESS,
          message: notiUtils.WITHDRAW_SUCCESS,
          autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
        }));
      } else {
        //fail
        setNotification((prevState) => ({
          ...prevState,
          type: notiUtils.DANGER,
          message: notiUtils.WITHDRAW_FAIL,
          autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
        }));
      }
    } catch (err) {
      //fail
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.DANGER,
        message: err.message,
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
    }
    setWithdrawing(false);
    setReload(!reload);
  };

  const openModal = async () => {
    setIsWithdrawPopUp(true);
  };

  if (!props.stakeAddress) {
    return null;
  }

  return (
    <div className={classes.Information}>
      <Modal
        show={isWithdrawPopUp}
        modalClosed={() => {
          setIsWithdrawPopUp(false);
        }}
        hasBackdrop
      >
        {isWithdrawPopUp ? (
          <WithdrawPopUp
            value={withdrawValue}
            submitHandler={withdrawHandler}
            withdrawAll={withdrawAllHandler}
            maxWithdrawAvailable={maxWithdrawAvailable}
            withdrawing={withdrawing}
          />
        ) : null}
      </Modal>
      {/* Stake Section */}
      {isStakeEnd ? (
        <div className={classes.StakeToken}>
          <Card>
            <div className={classes.StakeEnd}>Stake Token has ended!</div>
          </Card>
        </div>
      ) : (
        <div className={classes.StakeToken}>
          <StakeToken
            value={stakeValue}
            accountBalance={DREbalance}
            maxHandler={maxButtonClicked}
            changeHandler={onStakeValueChange}
            submitHandler={(e) => {
              stakeSubmitHandler(e);
            }}
            closed={isStakeEnd}
            loading={staking}
          />
        </div>
      )}

      {/* Account Staking Status */}
      <div className={classes.CurrentStake}>
        <CurrentStake
          DreStaked={stakingInfo.amount}
          closed={isStakeEnd}
          WithdrawableDRE={maxWithdrawAvailable}
          points={stakingInfo.point}
          maxPoints={stakingInfo.maxPoint}
          withdrawOnClick={openModal}
        />
      </div>
    </div>
  );
};

export default Stake;
