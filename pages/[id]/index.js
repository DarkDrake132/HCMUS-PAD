import React, { useEffect, useState, useContext } from "react";
import { WalletContext } from "../../context/WalletContext.js";
import { NotificationContext } from "../../context/NotificationContext.js";

import Image from "next/image";
import Head from "next/head";
import Big from "big.js";

import MediaLogo from "../../components/MediaLogo/MediaLogo.js";
import PoolInformation from "../../components/PoolInformations/PoolInformation/PoolInformation.js";
import SaleInformation from "../../components/PoolInformations/SaleInformation/SaleInformation.js";
import PoolAllocation from "../../components/PoolInformations/PoolAllocation/PoolAllocation.js";
import PoolAboutDetail from "../../components/PoolInformations/PoolAboutDetail/PoolAboutDetail.js";
import Modal from "../../components/ui/Modal/Modal.js";
import SwapTokenPopUp from "../../components/PoolInformations/SwapTokenPopUp/SwapTokenPopUp.js";
import UpcomingSale from "../../components/PoolInformations/UpcomingSale/UpcomingSale.js";
import FundRaisingGoal from "../../components/PoolInformations/FundRaisingGoal/FundRaisingGoal.js";
import Stake from "../../components/Stake/Stake";
import StakingLeaderBoard from "../../components/Stake/StakingLeaderBoard/StakingLeaderBoard";
import Card from "../../components/ui/Card/Card";
import TabBar from "../../components/ui/TabBar/TabBar.js";
import TabPanel from "../../components/ui/TabBar/TabPanel/TabPanel.js";

import classes from "../../styles/poolDetail/poolDetail.module.css";

//contract service
import {
  hasConnected,
  getChainId,
  getChainNameById,
  getGasPrice,
  getWeb3,
} from "../../contract/services/client/connection";
//contract service
import { isPoolPause } from "../../contract/services/client/pool";

import { isAccountKYC } from "../../contract/services/client/user";
//contract service
import * as poolStatus from "../../server/data-type/projectStatus";
import { getTokenInfo } from "../../contract/services/client/erc20";
import { getPool, swap } from "../../contract/services/client/pool";
import { useRouter } from "next/router";

//server import
import {
  getProjectById,
  getAllPoolName,
} from "../../server/db/controllers/project";

//utilities
import { isNumeric, roundUp } from "../../utility/NumberUtility";
import * as notiUtils from "../../utility/NotificationUtility";

// CUSTOM ICONS
import { EthereumLogo } from "../../components/Header/Header.js";

// MUI COMPONENTS
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const isUserSameNetwork = async (chainId) => {
  return (await getChainId()) === chainId;
};

function ActiveAndEndedSection(props) {
  const { walletAddress, balance, networkChain } = useContext(WalletContext);
  const { notification, setNotification, notiUtils } =
    useContext(NotificationContext);
  const GAS_TO_WEI = 300000,
    DEFAULT_AUTO_CLOSE_TIME = 5000;

  const router = useRouter();

  const [tokenData, setTokenData] = useState({
    informations: {
      name: "Loading",
      address: props.pool.tokenAddress,
      symbol: "Loading",
      decimals: "Loading",
      totalSupply: "Loading",
      swapValue: "Loading",
    },
    saleInformations: {
      beginTime: props.pool.beginTime,
      endTime: props.pool.endTime,
      saledTokenAmount: 0,
      tokenForSale: 0,
    },
  });

  const [poolData, setPoolData] = useState({
    poolHandler: undefined,
    informations: {
      poolName: props.pool.poolName,
      moneyRaise: props.pool.moneyRaise,
      TokenRaise: "Loading",
      minAllocation: "0",
      maxAllocation: "Loading",
      whitelist: false,
    },
    chainId: props.pool.chainId,
    purchases: [],
    joinable: false,
  });

  const [poolPause, setPoolPause] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [userSwapValue, setUserSwapValue] = useState("");
  const [maxAllocationAvailable, setMaxAllocationAvailable] = useState(0);
  const [minSwapNeeded, setMinSwapNeeded] = useState(true);
  const [gasPrice, setGasPrice] = useState(0);

  const fetchData = () => {
    setNotification((prevState) => ({
      ...prevState,
      type: notiUtils.PROCESSING,
      message: notiUtils.GETTING_DATA,
      autoCloseTime: "",
    }));

    getGasPrice().then((gasPrice) => {
      const web3 = getWeb3();
      setGasPrice(
        roundUp(web3.utils.fromWei((gasPrice * GAS_TO_WEI).toString(), "ether"))
      );
    });
    //fetch data
    getPool(props.pool.address).then(async (pool) => {
      const poolInfo = await pool.getInformation();
      const whitelisted = await pool.isWhitelisted();
      const maxAllocation = new Big(await pool.individualMaximumAmount())
        .div(new Big(10 ** poolInfo.decimals))
        .toFixed();
      const minAllocation = new Big(await pool.individualMinimumAmount)
        .div(new Big(10 ** poolInfo.decimals))
        .toFixed();
      const maxValue = new Big(poolInfo.tradeValue).mul(new Big(maxAllocation));
      const purchases = await pool.getMyPurchases();
      const newSaleInformations = {
        ...tokenData.saleInformations,
        saledTokenAmount: new Big(poolInfo.tokensAllocated)
          .div(new Big(10 ** poolInfo.decimals))
          .toFixed(),
        tokenForSale: new Big(poolInfo.tokensForSale)
          .div(new Big(10 ** poolInfo.decimals))
          .toFixed(),
      };
      const newPoolInformations = {
        ...poolData.informations,
        maxAllocation,
        minAllocation,
        TokenRaise: new Big(poolInfo.tokensForSale)
          .div(new Big(10 ** poolInfo.decimals))
          .toFixed(),
        whitelist: whitelisted,
      };
      const newPool = {
        ...poolData,
        informations: newPoolInformations,
        purchases,
        joinable: canUserJoinPool({ whitelisted, maxValue, purchases }),
        poolHandler: pool,
      };
      setPoolData(newPool);
      setMinSwapNeeded(purchases.length > 0 ? false : true);
      const tokenPrice = new Big(await pool.tradeValue)
        .div(new Big(10 ** 18))
        .toFixed();
      getTokenInfo(props.pool.tokenAddress).then((token) => {
        const newTokenInformations = {
          ...tokenData.informations,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals.toString(),
          totalSupply: new Big(token.totalSupply)
            .div(new Big(10 ** token.decimals))
            .toString(),
          swapValue: tokenPrice,
        };
        const newTokenData = {
          ...tokenData,
          informations: newTokenInformations,
          saleInformations: newSaleInformations,
        };
        setTokenData(newTokenData);
        //change the noti back to nothing
        setNotification((prevState) => ({
          ...prevState,
          message: "",
          autoCloseTime: "",
        }));
      });
    });
  };

  useEffect(() => {
    let isSubscribed = true;
    if (props.fetchValid) {
      if (isSubscribed) {
        fetchData();
      }
    }

    isPoolPause(props.pool.address).then((res) => {
      if (isSubscribed) {
        setPoolPause(res);
      }
    });
    return () => (isSubscribed = false);
  }, [props.fetchValid, poolPause]);

  //register metamask onAccountChange listener
  useEffect(() => {
    let isSubscribed = true;
    isUserSameNetwork(props.pool.chainId)
      .then((res) => {
        if (res) {
          if (props.fetchValid) {
            if (isSubscribed) {
              fetchData();
            }
          }
        } else {
          //wrong network
          setNotification((prevState) => ({
            ...prevState,
            type: notiUtils.WARNING,
            message: notiUtils.WRONG_NETWORK,
            autoCloseTime: "",
          }));
        }
      })
      .catch((err) => {
        setNotification((prevState) => ({
          ...prevState,
          type: notiUtils.DANGER,
          message: err.message,
          autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
        }));
      });
    return () => (isSubscribed = false);
  }, [walletAddress]);

  /**
   * function to check conditions on whether a user can join pool
   * @param {*} pool the pool's information retrieve from contract
   * @returns true/false whether a user can join pool
   */

  const canUserJoinPool = ({ whitelisted, purchases, maxValue }) => {
    //if pool is currently paused
    console.log(poolPause);
    if (poolPause) {
      return false;
    }
    // account isn't whitelisted
    if (!whitelisted) {
      return false;
    }
    // the pool hasn't started yet or has already ended
    if (props.pool.status != poolStatus.ACTIVE) {
      return false;
    }
    // user already allocate to maxAllocation
    let sum = new Big(0);
    for (let i = 0; i < purchases.length; i++) {
      sum = sum.add(purchases[i].fundsAmount);
    }
    if (sum.gte(maxValue)) {
      setMaxAllocationAvailable(0);
      return false;
    }
    setMaxAllocationAvailable(
      maxValue
        .minus(sum)
        .div(new Big(10 ** 18))
        .toFixed()
    );
    setUserSwapValue(maxAllocationAvailable);
    return true;
  };

  /**
   * handle when user click join pool
   */
  const joinPoolHandler = () => {
    setSwapping(true);
  };
  /**
   * handle when user close the swapTokenPopUp
   */
  const joinPoolCancelHandler = () => {
    if (
      notification.type === notiUtils.PROCESSING &&
      notification.message != ""
    ) {
      return;
    }
    setSwapping(false);
    setUserSwapValue("");
  };
  /**
   * set userSwapValue to maxAllocationAvailable
   */
  const setMaxAllocation = () => {
    if (balance < maxAllocationAvailable) setUserSwapValue(roundUp(balance));
    else setUserSwapValue(maxAllocationAvailable);
  };

  /**
   * function handle user input when swapping token
   */
  const onSwapValueChange = (e) => {
    const input = e.target.value;
    //if user attempt to allocate more than maxAllocation, set it to maxAllocation
    if (parseFloat(input) > maxAllocationAvailable) {
      setMaxAllocation();
    } else {
      setUserSwapValue(input);
    }
  };

  /**
   * function to check on conditions where user swap token
   * @returns true/false whether the swap conditions is valid
   */
  const checkSwapConditions = () => {
    if (userSwapValue <= 0) {
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.WARNING,
        message: "Swap value must be greater than zero!!!!",
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
      return false;
    } else if (
      userSwapValue <
        roundUp(
          tokenData.informations.swapValue * poolData.informations.minAllocation
        ) &&
      minSwapNeeded
    ) {
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.WARNING,
        message: "Swap value must be greater than Minimum Allocation!!!!",
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
      return false;
    } else if (!isNumeric(userSwapValue)) {
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.WARNING,
        message: "Swap value must not contains character!!!!",
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
      return false;
    }
    return true;
  };

  /**
   * function handle swap token submittion
   * @param {*} event the submit event
   * @returns nothing
   */
  const swapSubmitHandler = (event) => {
    event.preventDefault();
    if (!checkSwapConditions()) return;
    setNotification((prevState) => ({
      ...prevState,
      type: notiUtils.PROCESSING,
      message: notiUtils.PLEASE_WAIT,
      autoCloseTime: "",
    }));
    swap(
      props.pool.address,
      roundUp(userSwapValue / tokenData.informations.swapValue)
    )
      .then(() => {
        setNotification({
          type: notiUtils.SUCCESS,
          message: "Swap Completed!!!",
          autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
        });
        setSwapping(false);
        router.reload();
      })
      .catch((err) => {
        //use noti to display error later
        switch (err.code) {
          case 4001:
            setNotification({
              type: notiUtils.WARNING,
              message: notiUtils.TRANSACTION_DENY,
              autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
            });
            break;
          default:
            setNotification({
              type: notiUtils.DANGER,
              message: err.message,
              autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
            });
            break;
        }
        setSwapping(false);
      });
  };

  const claimHandler = (purchaseID) => {
    console.log(true);
    setNotification((prevState) => ({
      ...prevState,
      type: notiUtils.PROCESSING,
      message: notiUtils.PLEASE_WAIT,
      autoCloseTime: "",
    }));
    console.log(purchaseID);
    if (!poolPause) {
      poolData.poolHandler
        ?.redeemTokens(purchaseID)
        .then(() => {
          setNotification({
            type: notiUtils.SUCCESS,
            message: "Token claimed successfully!!!",
            autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
          });
          router.reload();
        })
        .catch((err) => {
          setNotification({
            type: notiUtils.DANGER,
            message: err.message,
            autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
          });
        });
    } else {
      poolData.poolHandler
        ?.redeemFunds(purchaseID)
        .then(() => {
          setNotification({
            type: notiUtils.SUCCESS,
            message: "Fund claimed successfully!!!",
            autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
          });
          router.reload();
        })
        .catch((err) => {
          setNotification({
            type: notiUtils.DANGER,
            message: err.message,
            autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
          });
        });
    }
  };

  let swapCard = null;

  if (swapping) {
    swapCard = (
      <form onSubmit={swapSubmitHandler}>
        <SwapTokenPopUp
          accountBalance={roundUp(balance)}
          minAllocation={
            minSwapNeeded
              ? roundUp(
                  tokenData.informations.swapValue *
                    poolData.informations.minAllocation
                )
              : 0
          }
          maxAllocation={roundUp(maxAllocationAvailable)}
          gasPrice={gasPrice}
          chainName={getChainNameById(poolData.chainId)}
          swapValue={tokenData.informations.swapValue}
          value={userSwapValue}
          symbol={tokenData.informations.symbol}
          changeHandler={(e) => {
            onSwapValueChange(e);
          }}
          loading={
            notification.type === notiUtils.PROCESSING &&
            notification.message != ""
          }
          maxHandler={setMaxAllocation}
        />
      </form>
    );
  }
  const errorMessage = poolPause
    ? props.pool.status == poolStatus.ENDED
      ? notiUtils.PAUSE_REDEEM
      : notiUtils.PAUSE_SWAP
    : null;
  return (
    <React.Fragment>
      <Modal show={swapping} modalClosed={joinPoolCancelHandler} hasBackdrop>
        {swapCard}
      </Modal>

      {errorMessage && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}

      <div className={classes.InforSection}>
        <div className={classes.PoolInformation}>
          <PoolInformation
            pool={poolData.informations}
            tokenSymbol={tokenData.informations.symbol}
            joinPoolHandler={joinPoolHandler}
            joinable={poolData.joinable}
          />
        </div>

        <div className={classes.SaleInformation}>
          <SaleInformation
            pool={{
              tokenInformations: tokenData.informations,
              saleInformations: tokenData.saleInformations,
            }}
            chainName={getChainNameById(poolData.chainId)}
          />
        </div>
      </div>
      <div className={classes.AllocationSection}>
        {tokenData.informations.decimals != "Loading" ? (
          <PoolAllocation
            allocations={poolData.purchases}
            status={props.pool.status}
            ENDED={poolStatus.ENDED}
            claimHandler={claimHandler}
            symbol={tokenData.informations.symbol}
            decimals={tokenData.informations.decimals}
            networkChain={networkChain}
          ></PoolAllocation>
        ) : null}
      </div>
    </React.Fragment>
  );
}

function UpcomingSection(props) {
  return (
    <React.Fragment>
      <div className={classes.InforSection}>
        <div className={classes.UpcomingSale}>
          <UpcomingSale
            name={props.pool.poolName}
            beginTime={props.pool.beginTime}
            endTime={props.pool.endTime}
            totalSupply={props.pool.totalSupply}
            whitelistBegin={props.pool.whitelistBegin}
            whitelistEnd={props.pool.whitelistEnd}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

function DetailPage(props) {
  const DEFAULT_AUTO_CLOSE_TIME = 5000;

  const { walletAddress, balance } = useContext(WalletContext);
  const { notification, setNotification, notiUtils } =
    useContext(NotificationContext);
  //current handle for data lost case
  const router = new useRouter();
  if (props.hasError) {
    router.reload(); //reload the page
  }

  const [fetchValid, setFetchValid] = useState(false);
  const [showTab, setShowTab] = useState(0);
  const [isKYC, setIsKYC] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      try {
        //user haven't connected their wallet
        if (walletAddress) {
          setIsKYC(await (await isAccountKYC(walletAddress)).json());
          const sameNetwork = await isUserSameNetwork(props.pool.chainId);
          if (sameNetwork) {
            setFetchValid(true);
            setNotification((prevState) => ({
              ...prevState,
              message: "",
            }));
          } else {
            //wrong network
            setNotification((prevState) => ({
              ...prevState,
              type: notiUtils.WARNING,
              message: notiUtils.WRONG_NETWORK,
              autoCloseTime: "",
            }));
          }
        } else {
          setNotification((prevState) => ({
            ...prevState,
            type: notiUtils.WARNING,
            message: notiUtils.CONNECT_WALLET,
            autoCloseTime: "",
          }));
        }
      } catch (err) {
        setNotification((prevState) => ({
          ...prevState,
          type: notiUtils.DANGER,
          message: "Please Reload! " + err.message,
          autoCloseTime: "",
        }));
      }
    };
    authenticate();
  }, [walletAddress]);

  return (
    <div className={classes.Page}>
      <Head>
        <title>{props.pool.poolName}</title>
      </Head>
      {/* Banner */}
      <div className={classes.Banner}>
        {/* logo project, name and address goes here, Logo could be change later */}
        <div className={classes.Logo}>
          <Image
            src={props.pool.imgSrc}
            alt="Banner-Background"
            width="170px"
            height="150px"
          />
        </div>
        {/* Project name */}
        <h1 className={classes.PoolName}>{props.pool.poolName}</h1>
        {/* Project Address */}
        <p className={classes.PoolAddress}>{props.pool.address}</p>
        <div className={classes.Infor}>
          <div className={classes.StatusAndNetwork}>
            {/* Project status */}
            <h2 className={classes.Status}>{props.pool.status}</h2>
          </div>
          <div className={classes.SocialMedia}>
            <ul>
              {/* Social media */}
              {props.pool?.telegram && (
                <li>
                  <MediaLogo
                    link={props.pool?.telegram || "#"}
                    icon="telegram"
                  ></MediaLogo>
                </li>
              )}

              {props.pool?.twitter && (
                <li>
                  <MediaLogo
                    link={props.pool?.twitter || "#"}
                    icon="twitter"
                  ></MediaLogo>
                </li>
              )}

              {props.pool?.medium && (
                <li>
                  <MediaLogo
                    link={props.pool?.medium || "#"}
                    icon="medium"
                  ></MediaLogo>
                </li>
              )}

              {props.pool?.github && (
                <li>
                  <MediaLogo
                    link={props.pool?.github || "#"}
                    icon="github"
                  ></MediaLogo>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {props.pool.status !== poolStatus.UPCOMING ? (
        <ActiveAndEndedSection {...props} fetchValid={fetchValid} />
      ) : (
        <UpcomingSection {...props} isKYC={isKYC} />
      )}

      {props.pool.stakeAddress ? (
        <Stake
          stakeAddress={props.pool.stakeAddress}
          whitelistEnd={props.pool.whitelistEnd}
        />
      ) : null}
      <div className={classes.PoolAboutSection}>
        <Card>
          <TabBar
            titleList={
              props.pool.stakeAddress
                ? ["About Project", "Staking Leader Board"]
                : ["About Project"]
            }
            showTab={showTab}
            setShowTab={setShowTab}
          >
            <TabPanel index={0} showIndex={showTab}>
              <PoolAboutDetail
                aboutInfo={{
                  description: props.pool.description,
                  website: props.pool.website,
                }}
              />
            </TabPanel>
            {props.pool.stakeAddress ? (
              <TabPanel index={1} showIndex={showTab}>
                <StakingLeaderBoard stakeAddress={props.pool.stakeAddress} />
              </TabPanel>
            ) : null}
          </TabBar>
        </Card>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const projects = await getAllPoolName();

  const paths = projects.map((project) => {
    return project.Name.toLowerCase().split(" ").join("-");
  });

  const newPaths = [];

  for (let i = 0; i < paths.length; i++) {
    newPaths.push({ params: { id: paths[i] } });
  }

  //console.log(newPaths)
  return {
    paths: newPaths,
    fallback: false,
  };
}

/**
 * Function returns the status of the current
 * @param {*} beginTime
 * @param {*} endTime
 * @returns
 */
const statusType = (beginTime, endTime) => {
  const beginDate = new Date(beginTime * 1000);
  const now = Date.now();
  if (beginDate - now <= 0) {
    const endDate = new Date(endTime * 1000);
    if (endDate - now <= 0) {
      return poolStatus.ENDED;
    } else {
      return poolStatus.ACTIVE;
    }
  }
  return poolStatus.UPCOMING;
};
export async function getStaticProps(context) {
  const id = context.params.id;

  const revalidate = 300; // revalidate after 300 seconds

  try {
    const poolBasicInfo = await getProjectById(id);
    const poolStatus = statusType(
      poolBasicInfo.BeginTime,
      poolBasicInfo.EndTime
    );
    //console.log('poolBasicInfo', poolBasicInfo);
    const props = {
      pool: {
        address: poolBasicInfo.PoolAddress,
        status: poolStatus,
        chainId: poolBasicInfo.ChainId,
        poolName: poolBasicInfo.Name,
        imgSrc: poolBasicInfo.LogoUrl,
        twitter: poolBasicInfo.Twitter,
        telegram: poolBasicInfo.Telegram,
        github: poolBasicInfo.Github,
        medium: poolBasicInfo.Medium,
        moneyRaise: poolBasicInfo.MoneyRaise,
        tokenAddress: poolBasicInfo.TokenAddress,
        ownerAddress: poolBasicInfo.OwnerAddress,
        beginTime: poolBasicInfo.BeginTime,
        endTime: poolBasicInfo.EndTime,
        whitelistBegin: poolBasicInfo.WhitelistBegin,
        whitelistEnd: poolBasicInfo.WhitelistEnd,
        description: poolBasicInfo.Description,
        website: poolBasicInfo.Website,
        whitelistLink: poolBasicInfo.WhitelistLink,
        stakeAddress: poolBasicInfo.StakeAddress,
      },
    };
    return {
      props: {
        hasError: false,
        ...props,
      },
    };
  } catch (error) {
    const errorMessage = error.message;
    return { revalidate, props: { hasError: errorMessage } };
  }
}
export default DetailPage;
