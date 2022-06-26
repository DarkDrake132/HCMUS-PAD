import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Big from "big.js";

//context
import { WalletContext } from "../../../context/WalletContext";
import { NotificationContext } from "../../../context/NotificationContext";

// Component
import Modal from "../../../components/ui/Modal/Modal";
import Card from "../../../components/ui/Card/Card";
import Button from "../../../components/ui/Button/Button";
import Input from "../../../components/ui/Input/Input";

//server import
import { getProjectById } from "../../../server/db/controllers/project";

//contract service
import {
  hasConnected,
  getAccount,
  getChainId,
  getWeb3,
} from "../../../contract/services/client/connection";
import { getPool } from "../../../contract/services/client/pool";

//css
import classes from "../../../styles/poolDetail/poolDetail.module.css";

function EditPopUp(props) {
  const [value, setValue] = useState(props.value);
  const [displayValue, setDisplayValue] = useState(props.value);

  const changeHandler = (e) => {
    let newValue = e.target.value;
    setDisplayValue(newValue);
    if (props.field === "startDate" || props.field === "endDate") {
      newValue = Math.floor(new Date(newValue) / 1000);
    }
    setValue(newValue);
  };

  return (
    <Card style="Tertiary">
      <div className={classes.EditPopup}>
        <h3>{getTitleOfField(props.field)}</h3>
        <Input
          type={
            props.field === "startDate" || props.field === "endDate"
              ? "datetime-local"
              : ""
          }
          value={
            props.field === "startDate" || props.field === "endDate"
              ? displayValue
              : value
          }
          changed={changeHandler}
        ></Input>
        <Button
          style="SubmitEditPoolBtn"
          type="submit"
          clicked={() => props.submitHandler(value)}
        >
          Submit Change
        </Button>
      </div>
    </Card>
  );
}

function EditDetailPage(props) {
  const DEFAULT_AUTO_CLOSE_TIME = 5000;

  //current handle for data lost case
  const router = useRouter();
  if (props.hasError) {
    router.reload(); //reload the page
  }

  const { walletAddress } = useContext(WalletContext);

  const { notification, setNotification, notiUtils } =
    useContext(NotificationContext);

  const [editAllowed, setEditAllowed] = useState(false);
  const [pool, setPool] = useState({
    ownerAddress: props.pool.ownerAddress,
  });
  const [poolHandler, setPoolHandler] = useState(null);

  const [currentEditField, setCurrentEditField] = useState("");
  const [reload, setReload] = useState(false);

  const isOwner = async () => {
    return walletAddress == props.pool.ownerAddress;
  };

  const isUserSameNetwork = async (chainId) => {
    return (await getChainId()) === chainId;
  };

  const fetchPoolFromContract = async () => {
    getPool(props.pool.address).then(async (p) => {
      setPoolHandler(p);
      const poolInfo = await p.getInformation();
      setPool({
        ...pool,
        erc20: poolInfo.erc20,
        startDate: new Big(poolInfo.startDate).toFixed(),
        endDate: new Big(poolInfo.endDate).toFixed(),
        tokenForSale: new Big(poolInfo.tokensForSale)
          .div(new Big(10 ** poolInfo.decimals))
          .toFixed(),
      });
    });
    console.log("Pool", pool);
  };

  useEffect(() => {
    const effectFunction = async () => {
      //user haven't connect wallet
      try {
        if (!walletAddress) {
          setEditAllowed(false);
          setNotification((prevState) => ({
            ...prevState,
            type: notiUtils.DANGER,
            message: notiUtils.CONNECT_WALLET,
            autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
          }));
        } else {
          const accessAllow = await isOwner();
          const chainId = await getChainId();
          setEditAllowed(
            accessAllow &&
              props.pool.chainId == chainId &&
              props.pool.beginTime - Date.now() / 1000 > 7 * 24 * 60 * 60
          );

          if (!accessAllow) {
            setNotification({
              fixed: true,
              type: notiUtils.DANGER,
              message:
                "Your wallet doesn not have access to this page!",
            });
          } else {
            // same network
            if (await isUserSameNetwork(props.pool.chainId)) {
              await fetchPoolFromContract();
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
          }
        }
      } catch (err) {
        setEditAllowed(false);
        //Something went wrong
        setNotification((prevState) => ({
          ...prevState,
          type: notiUtils.DANGER,
          message: err.message,
          autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
        }));
      }
    }
    effectFunction();
  }, [walletAddress, reload]);

  const updateDataFromPool = async () => {
    const resJS = await fetch(
      `/api/pools/${props.pool.poolName.toLowerCase().split(" ").join("-")}`,
      {
        method: "PATCH",
      }
    );

    const res = await resJS.json();

    if (!res.updated) {
      throw res.error;
    }
    return res.project;
  };

  const setERC20 = async (value) => {
    try {
      await poolHandler.setErc20(value);
      const res = await updateDataFromPool();
      return res != null;
    } catch (error) {
      setNotification((prevState) => ({
        ...prevState,
        fixed: false,
        type: notiUtils.DANGER,
        message: error.message,
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
    }
    return false;
  };
  const setStartDate = async (value) => {
    try {
      const time = new Date(value);
      await poolHandler.setStartDate(value);
      const res = await updateDataFromPool();
      return res != null;
    } catch (error) {
      setNotification((prevState) => ({
        ...prevState,
        fixed: false,
        type: notiUtils.DANGER,
        message: error.message,
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
    }
  };
  const setEndDate = async (value) => {
    try {
      await poolHandler.setEndDate(value);
      const res = await updateDataFromPool();
      return res != null;
    } catch (error) {
      setNotification((prevState) => ({
        ...prevState,
        fixed: false,
        type: notiUtils.DANGER,
        message: error.message,
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
    }
  };
  const setTokenForSale = async (value) => {
    try {
      const decimals = (await poolHandler.decimals).toNumber();
      await poolHandler.setTokensForSale(
        new Big(value).mul(new Big(10 ** decimals)).toFixed()
      );
      const res = await updateDataFromPool();
      return res != null;
    } catch (error) {
      setNotification((prevState) => ({
        ...prevState,
        fixed: false,
        type: notiUtils.DANGER,
        message: error.message,
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
    }
    return false;
  };
  const setOwnerAddress = async (value) => {
    try {
      await poolHandler.setOwner(value);
      const res = await updateDataFromPool();
      return res != null;
    } catch (error) {
      setNotification((prevState) => ({
        ...prevState,
        fixed: false,
        type: notiUtils.DANGER,
        message: error.message,
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
    }
  };

  const isDataValid = (value) => {
    if (!value) {
      setNotification((prevState) => ({
        ...prevState,
        fixed: false,
        type: notiUtils.WARNING,
        message: "Data should not be null!",
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      }));
      return false;
    }
    if (currentEditField == "startDate" || currentEditField == "endDate"){
      if (new Date(value*1000) - new Date() <= 7 * 3600 * 1000){
        setNotification((prevState) => ({
          ...prevState,
          fixed: false,
          type: notiUtils.WARNING,
          message: "Can only change information before at least 7 days until startDate",
          autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
        }));
      }
      return false;
    }
    return true;
  }

  const popUpSubmitHandler = async (value) => {
    setNotification((prevState) => ({
      ...prevState,
      type: notiUtils.PROCESSING,
      message: notiUtils.PLEASE_WAIT,
      autoCloseTime: "",
    }));
    if (!isDataValid(value)) {
      return;
    }
    let res = false;

    try {
      switch (currentEditField) {
        case "erc20":
          res = await setERC20(value);
          break;
        case "startDate":
          res = await setStartDate(value);
          break;
        case "endDate":
          res = await setEndDate(value);
          break;
        case "tokenForSale":
          res = await setTokenForSale(value);
          break;
        case "ownerAddress":
          res = await setOwnerAddress(value);
          break;
      }
    } catch (error) {
      setNotification({
        fixed: false,
        type: notiUtils.DANGER,
        message: error.message,
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      });
    }

    if (res) {
      setNotification({
        fixed: false,
        type: notiUtils.SUCCESS,
        message: `Update ${currentEditField
          .toUpperCase()
          .split(" ")
          .join("-")} Successfully`,
        autoCloseTime: DEFAULT_AUTO_CLOSE_TIME,
      });
    } else {
    }
    resetPopUp();
    setReload(!reload);
  };

  const resetPopUp = () => {
    setCurrentEditField("");
  };

  const popUpCloseHandler = () => {
    resetPopUp();
  };

  if (editAllowed) {
    return (
      <div className={classes.Page}>
        <Head>
          <title>{props.pool.poolName}</title>
        </Head>

        <Modal
          show={currentEditField}
          modalClosed={popUpCloseHandler}
          hasBackdrop
        >
          {currentEditField ? (
            <EditPopUp
              field={currentEditField}
              value={pool[`${currentEditField}`]}
              submitHandler={popUpSubmitHandler}
            />
          ) : null}
        </Modal>

        <div className={classes.EditCard}>
          <div className={classes.EditComponent}>
            <div className={classes.Title}>
              <h2>{props.pool.poolName}</h2>
            </div>

            <div className={classes.GridRow}>
              <div className={classes.Field}>
                <h3>{getTitleOfField("erc20")}</h3>
                <div className={classes.Input}>
                  <Input
                    style="NoClick"
                    value={pool.erc20 ? pool.erc20 : ""}
                    changed={() => {}}
                  ></Input>
                  <Button
                    type="submit"
                    style="RedGradient EditBtn"
                    disabled={!editAllowed}
                    clicked={() => setCurrentEditField("erc20")}
                  >
                    <span className={"material-icons"}>edit</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className={classes.GridRow}>
              <div className={classes.Field}>
                <h3>{getTitleOfField("startDate")}</h3>
                <div className={classes.Input}>
                  <Input
                    style="NoClick"
                    changed={() => {}}
                    value={new Date(
                      (pool.startDate ? pool.startDate : 0) * 1000
                    )
                      .toISOString()
                      .split(".")[0]
                      .replace("T", " ")}
                  />
                  <Button
                    type="submit"
                    style="RedGradient EditBtn"
                    disabled={!editAllowed}
                    clicked={() => setCurrentEditField("startDate")}
                  >
                    <span className={"material-icons"}>edit</span>
                  </Button>
                </div>
              </div>
              <div className={classes.Field}>
                <h3>{getTitleOfField("endDate")}</h3>
                <div className={classes.Input}>
                  <Input
                    style="NoClick"
                    changed={() => {}}
                    value={new Date((pool.endDate ? pool.endDate : 0) * 1000)
                      .toISOString()
                      .split(".")[0]
                      .replace("T", " ")}
                  />
                  <Button
                    type="submit"
                    style="RedGradient EditBtn"
                    disabled={!editAllowed}
                    clicked={() => setCurrentEditField("endDate")}
                  >
                    <span className={"material-icons"}>edit</span>
                  </Button>
                </div>
              </div>
            </div>

            <div className={classes.GridRow}>
              <div className={classes.Field}>
                <h3>{getTitleOfField("tokenForSale")}</h3>
                <div className={classes.Input}>
                  <Input
                    style="NoClick"
                    type="number"
                    value={pool.tokenForSale ? pool.tokenForSale : ""}
                    changed={() => {}}
                  ></Input>
                  <Button
                    type="submit"
                    style="RedGradient EditBtn"
                    disabled={!editAllowed}
                    clicked={() => setCurrentEditField("tokenForSale")}
                  >
                    <span className={"material-icons"}>edit</span>
                  </Button>
                </div>
              </div>
              <div className={classes.Field}>
                <h3>{getTitleOfField("ownerAddress")}</h3>
                <div className={classes.Input}>
                  <Input
                    style="NoClick"
                    value={pool.ownerAddress}
                    changed={() => {}}
                  ></Input>
                  <Button
                    type="submit"
                    style="RedGradient EditBtn"
                    disabled={!editAllowed}
                    clicked={() => setCurrentEditField("ownerAddress")}
                  >
                    <span className={"material-icons"}>edit</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={classes.Modal}>
        <p>Your wallet does not have access to this page</p>
        <p>
          Recheck the wallet address to see if it match with the owner of the
          pool
        </p>
      </div>
    );
  }
}

function getTitleOfField(field) {
  switch (field) {
    case "erc20":
      return "ERC20 Address";
    case "startDate":
      return "Start Date";
    case "endDate":
      return "End Date";
    case "tokenForSale":
      return "Token For Sale";
    case "ownerAddress":
      return "Owner's Address";
  }
}

export async function getStaticProps(context) {
  const id = context.params.id;

  const revalidate = 300; // revalidate after 300 seconds

  try {
    const poolBasicInfo = await getProjectById(id);
    const props = {
      pool: {
        address: poolBasicInfo.PoolAddress,
        chainId: poolBasicInfo.ChainId,
        poolName: poolBasicInfo.Name,
        moneyRaise: poolBasicInfo.MoneyRaise,
        tokenAddress: poolBasicInfo.TokenAddress,
        ownerAddress: poolBasicInfo.OwnerAddress,
        beginTime: poolBasicInfo.BeginTime,
        endTime: poolBasicInfo.EndTime,
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

export async function getStaticPaths() {
  const paths = [];
  return {
    paths,
    fallback: "blocking",
  };
}

export default EditDetailPage;
