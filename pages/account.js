import Head from "next/head";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { WalletContext } from "../context/WalletContext";
import { NotificationContext } from "../context/NotificationContext";

import { getAccount } from "../contract/services/client/connection";
import {
  getCreatedPools,
  getJoinedPools,
  getPool,
  isPoolFunded,
  switchPauseStatus,
  isPoolPause,
} from "../contract/services/client/pool";

import { getDREBalance } from "../contract/services/client/erc20";
import { isAccountKYC } from "../contract/services/client/user";

import Button from "../components/ui/Button/Button";
import PoolListItems from "../components/PoolListItems/PoolListItems";
import Card from "../components/ui/Card/Card";
import Modal from "../components/ui/Modal/Modal";

import { getRemainingTimeString, isTimePassed } from "../utility/DateUtility";
import { numberFormatter, BigNumToNormal } from "../utility/NumberUtility";

import classes from "../styles/Account.module.css";
import { getErc20 } from "../contract/services/client/erc20";
import Big from "big.js";

export default function Account() {
  const router = useRouter();

  const { walletAddress, networkChain } = useContext(WalletContext);
  const { notification, setNotification, notiUtils } =
    useContext(NotificationContext);
  const [KYCStatus, setKYCStatus] = useState(false);
  const [totalDRETokens, setTotalDRETokens] = useState(0);
  const ownerProjectHeader = ["Pool", "Earned", "Unsold Token", "Action"];
  const joinedProjectHeader = [
    "Pool",
    "Progress",
    "Network",
    "Ending",
    "Total Raise",
  ];
  const [ownerProjects, setOwnerProjects] = useState();
  const [joinedProjects, setJoinedProjects] = useState();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawContent, setWithdrawContent] = useState({
    address: "",
    tokenforsale: "",
    totalSoldToken: "",
    totalRaise: "",
  });

  useEffect(() => {
    setOwnerProjects();
    setJoinedProjects();
    if (walletAddress) {
      fetchData();
    } else {
      //tell user that they have to connect to view the swapInformations
      setNotification((prevState) => {
        return {
          ...prevState,
          type: notiUtils.WARNING,
          message: notiUtils.CONNECT_WALLET,
        };
      });
    }
  }, [walletAddress, reload]);

  // if the pool has ended then return a function to change pool state when opening withdraw modal
  // else returning an empty function to prevent accidently changing pool state
  const withdrawButtonOnClick = (
    e,
    time,
    address,
    tokenForSale,
    totalSoldToken,
    totalRaise
  ) => {
    e.stopPropagation();
    if (isTimePassed(time)) {
      openWithdrawModal(address, tokenForSale, totalSoldToken, totalRaise);
    }
  };
  //function to open withdraw modal
  const openWithdrawModal = (
    address,
    tokenForSale,
    totalSoldToken,
    totalRaise
  ) => {
    setWithdrawContent({
      address: address,
      tokenforsale: tokenForSale,
      totalSoldToken: totalSoldToken,
      totalRaise: totalRaise,
    });
    setWithdrawing(true);
  };

  const fundButtonOnClick = async (event, pool) => {
    event.stopPropagation();
    try {
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.PROCESSING,
        message: "Loading!",
        autoCloseTime: "",
      }));
      const poolHandler = await getPool(pool.poolAddress);
      await poolHandler.fund(
        Big(pool.tokenForSale)
          .mul(Big(10 ** 18))
          .toFixed()
      );
      setNotification((prevState) => ({
        ...prevState,
        message: "Fund completed!",
        type: notiUtils.SUCCESS,
        autoCloseTime: 5000,
      }));
      setReload(!reload);
    } catch (e) {
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.DANGER,
        message: e.message,
        autoCloseTime: 5000,
      }));
    }
  };

  const editButtonOnClick = (event, poolId) => {
    event.stopPropagation();
    router.push(`/${poolId}/edit`);
  };

  const pauseButtonOnClick = async (event, poolAddress) => {
    event.stopPropagation();
    setNotification((prevState) => ({
      ...prevState,
      type: notiUtils.PROCESSING,
      message: "Loading!",
      autoCloseTime: "",
    }));
    try {
      await switchPauseStatus(poolAddress);
      setNotification((prevState) => ({
        ...prevState,
        message: "Fund completed!",
        type: notiUtils.SUCCESS,
        autoCloseTime: 5000,
      }));
      setReload(!reload);
    } catch (e) {
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.DANGER,
        message: e.message,
        autoCloseTime: 5000,
      }));
    }
  };

  const fetchData = () => {
    setLoading(true);
    setNotification((prevState) => ({
      ...prevState,
      type: notiUtils.PROCESSING,
      message: notiUtils.GETTING_DATA,
    }));
    getAccount()
      .then((account) => {
        Promise.all([
          //fetch data for owner pools
          isAccountKYC(account).then(async (res) => {
            const isKYC = await res.json();
            setKYCStatus(isKYC);
          }),
          getCreatedPools(account).then(async (pools) => {
            console.log(pools);

            const data = await Promise.all(
              pools.map(async (pool) => {
                let displayButtons = [
                  {
                    style: "GreenGradient FundBtn",
                    clicked: (e) => fundButtonOnClick(e, pool),
                    content: "Fund",
                  },
                  {
                    style: "RedGradient EditBtn",
                    clicked: (e) => editButtonOnClick(e, pool.id),
                    content: "Edit",
                  },
                ];
                if (await isPoolFunded(pool.poolAddress)) {
                  displayButtons = [
                    {
                      style: "WithdrawBtn Disable",
                      clicked: (e) => {},
                      content: "Funded",
                    },
                  ];
                }
                if (
                  isTimePassed(pool.beginTime) &&
                  !isTimePassed(pool.endTime)
                ) {
                  displayButtons = [
                    {
                      style: "WithdrawBtn FundBtn",
                      clicked: (e) => pauseButtonOnClick(e, pool.poolAddress),
                      content: (await isPoolPause(pool.poolAddress))
                        ? "UnPause"
                        : "Pause",
                    },
                  ];
                }

                if (isTimePassed(pool.endTime)) {
                  displayButtons = [
                    {
                      style: "WithdrawBtn",
                      clicked: (e) =>
                        withdrawButtonOnClick(
                          e,
                          pool.endTime,
                          pool.poolAddress,
                          pool.tokenForSale,
                          pool.totalSoldToken,
                          pool.totalRaise
                        ),
                      content: "Withdraw",
                    },
                  ];
                }

                console.log(pool);

                return {
                  id: pool.id,
                  poolName: pool.poolName,
                  poolAddress: pool.poolAddress,
                  status: "owner",
                  imgSrc: pool.logo,
                  display: {
                    totalRaise: `${numberFormatter(pool.totalSoldToken)}  ${
                      networkChain.chainName
                    }`,
                    unsoldToken: `${pool.tokenForSale - pool.totalSoldToken}`,
                  },
                  buttons: displayButtons,
                };
              })
            );

            setOwnerProjects(data);
          }),
          //fetch data for joined pools
          getJoinedPools(account).then((pools) => {
            setJoinedProjects(
              pools.map((pool) => {
                return {
                  id: pool.id,
                  poolName: pool.poolName,
                  status: pool.status,
                  imgSrc: pool.logo,
                  display: {
                    progress: {
                      current: pool.totalSoldToken,
                      total: pool.tokenForSale,
                    },
                    network: `${networkChain.chainName}`,
                    endTime: getRemainingTimeString(pool.endTime),
                    moneyRaise: `${numberFormatter(pool.totalRaise)} ${
                      networkChain.chainName
                    }`,
                  },
                };
              })
            );
          }),
        ])
          // after fetch all data, set the notification if it hasn't closed by itself yet
          .then(() => {
            setNotification((prevState) => ({
              ...prevState,
              message: "",
            }));
            setLoading(false);
          })
          .catch((err) => {
            setNotification((prevState) => ({
              ...prevState,
              type: notiUtils.DANGER,
              message: err.message,
            }));
            setLoading(false);
          });
      })
      .catch((err) => {
        setNotification((prevState) => ({
          ...prevState,
          type: notiUtils.DANGER,
          message: err.message,
        }));
        setLoading(false);
      });
    //get DRE token from wallet
    getDREBalance(walletAddress).then((dreBalance) => {
      setTotalDRETokens(BigNumToNormal(dreBalance));
    });
  };

  //
  const withdrawHandler = (address) => {
    setLoading(true);
    getPool(address).then((pool) => {
      Promise.all([pool.withdrawUnsoldTokens(), pool.withdrawFunds()])
        .then(() => {
          setLoading(false);
          setNotification((prevState) => ({
            ...prevState,
            type: notiUtils.SUCCESS,
            message: notiUtils.WITHDRAW_SUCCESS,
          }));
        })
        .catch((err) => {
          setLoading(false);
          setNotification((prevState) => ({
            ...prevState,
            type: notiUtils.DANGER,
            message: err.message,
          }));
        });
    });
    setReload(!reload);
  };

  //handle KYC function
  const KYCHandler = () => {
    window.open(
      "https://verify-with.blockpass.org/?clientId=dreamstarter_ido_0338e&serviceName=Dreamstarter%20IDO&env=prod"
    );
  };

  //withdraw content displaying
  const withdrawInfomation = (
    <Card>
      <div className={classes.WithdrawPopup}>
        <div className={classes.Title}>
          <h3>Withdraw Token</h3>
        </div>
        <div className={classes.WithdrawInformation}>
          <div className={classes.TokenInfo}>
            <p className={classes.BoldLabel}>Total {networkChain.chainName}:</p>
            <p className={classes.LightLabel}>
              {withdrawContent.totalSoldToken} tokens
            </p>
          </div>
          <div className={classes.TokenInfo}>
            <p className={classes.BoldLabel}>UnsoldToken:</p>
            <p className={classes.LightLabel}>
              {withdrawContent.tokenforsale - withdrawContent.totalSoldToken}{" "}
              tokens
            </p>
          </div>
        </div>
        <Button
          style="WithdrawAllBtn"
          loading={loading}
          disabled={loading}
          clicked={() => {
            withdrawHandler(withdrawContent.address);
          }}
        >
          Withdraw All Tokens
        </Button>
      </div>
    </Card>
  );

  return (
    <div className={classes.Page}>
      <Head>
        <title>Your Account</title>
      </Head>
      <Modal
        show={withdrawing}
        hasBackdrop={true}
        modalClosed={() => {
          setWithdrawing(false);
        }}
      >
        {withdrawInfomation}
      </Modal>
      <div className={classes.Information}>
        {/* Account informations */}
        <Card style="WhiteBorder">
          <div className={classes.WalletInfor}>
            <div className={classes.Title}>Wallet balance</div>
            <div className={classes.WalletToken}>
              <h2>{numberFormatter(totalDRETokens)}</h2>
              <p>DRE</p>
            </div>
            <p className={classes.Noti}>
              You currently have {totalDRETokens} Dream Token <br />
              in your wallet
            </p>
          </div>
        </Card>
        {/* Account KYC status */}
        <Card style="DashedBorder">
          <div className={classes.KYCInfor}>
            <h2 className={classes.Title}>KYC Status</h2>
            <p className={classes.Noti}>
              KYC now to join the future journey with us
            </p>
            <p className={KYCStatus ? classes.Normal : classes.Danger}>
              Status:{" "}
              <span>
                {KYCStatus
                  ? "Your wallet has been KYC"
                  : "Your wallet hasn't been KYC yet"}
              </span>
            </p>
            <Button
              style="AccentGradient Squared KYCBtn"
              disabled={KYCStatus}
              clicked={KYCHandler}
            >
              KYC now
            </Button>
          </div>
        </Card>
      </div>
      {/* ProjectList */}
      <div>
        <PoolListItems
          loading={!ownerProjects}
          title="Your Projects"
          status="owner"
          header={ownerProjectHeader}
          data={ownerProjects}
        />
        <PoolListItems
          loading={!joinedProjects}
          title="Participation History"
          status="joined"
          header={joinedProjectHeader}
          data={joinedProjects}
        />
      </div>
    </div>
  );
}
