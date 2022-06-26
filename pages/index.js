import Head from "next/head";

import { Fragment, useState, useContext } from "react";
import { useRouter } from "next/router";

import { NotificationContext } from "../context/NotificationContext";

import Button from "../components/ui/Button/Button";
import PoolList from "../components/Pools/PoolList/PoolList";
import ChainLogo from "../components/ui/ChainLogo/ChainLogo";
import Modal from "../components/ui/Modal/Modal";
import Card from "../components/ui/Card/Card";
import Input from "../components/ui/Input/Input";

import classes from "../styles/Home.module.css";

//server helper functions
import { getPools } from "../contract/services/server/pool";
import projectStatus from "../server/data-type/projectStatus";

//contract helper functions
import { getChainNameById } from "../contract/services/client/connection";

//CHAINS
import { CHAIN } from "../utility/Constant";

function MailSubscribePopUp(props) {
  const [value, setValue] = useState(props.value);

  const changeHandler = (e) => {
    let newValue = e.target.value;
    setValue(newValue);
  };

  return (
    <Card style="Tertiary">
      <div className={classes.EditPopup}>
        <h3>Subscribe for upcoming pool</h3>
        <Input
          value={value}
          changed={changeHandler}
          placeholder="example@gmail.com"
        ></Input>
        <Button
          style="SubmitEditPoolBtn"
          type="submit"
          clicked={(event) => props.submitHandler(event, value)}
        >
          Subscribe
        </Button>
      </div>
    </Card>
  );
}

export default function Home(props) {
  const router = useRouter();

  function RedirectUserToPools() {
    router.push("/pools");
  }

  const { notification, setNotification, notiUtils } =
    useContext(NotificationContext);

  const [isSubscribeClicked, setIsSubscribeClicked] = useState(false);

  let liveAndUpcomingList = (
    <p className={classes.EmptyAnnounce1}>This list is empty !!!</p>
  );
  if (props.activePools?.length > 0 || props.upcomingPools?.length > 0) {
    liveAndUpcomingList = (
      <PoolList pools={props.activePools.concat(props.upcomingPools)} />
    );
  }

  let endedSection = (
    <div className={classes.EndedPoolWrapper}>
      <div className={classes.EndedPools}>
        <h2>Ended Pools</h2>
        <p className={classes.EmptyAnnounce2}>This list is empty !!!</p>
      </div>
    </div>
  );
  if (props.endedPools?.length > 0) {
    endedSection = (
      <div className={classes.EndedPoolWrapper}>
        <div className={classes.EndedPools}>
          <h2>Ended Pools</h2>
          <PoolList pools={props.endedPools} />
        </div>
        <div className={classes.Viewmore}>
          <Button style="Tertiary ViewmoreBtn" clicked={RedirectUserToPools}>
            View more
          </Button>
        </div>
      </div>
    );
  }
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const sendEmailToServer = async (email) => {
    const response = await fetch("/api/register-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    const res = await response.json();
    if (res.created) {
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.SUCCESS,
        message: "Email was subscribed successfully!",
        autoCloseTime: "5000",
      }));
    } else {
      if (res.email) {
        setNotification((prevState) => ({
          ...prevState,
          type: notiUtils.DANGER,
          message: "Email was already subscribed!",
          autoCloseTime: "5000",
        }));
      }
    }
  };

  const subcribeHandler = async (event, email) => {
    event.preventDefault();
    setNotification((prevState) => ({
      ...prevState,
      type: notiUtils.PROCESSING,
      message: notiUtils.PLEASE_WAIT,
      autoCloseTime: "",
    }));
    try {
      if (validateEmail(email)) {
        //send mail to server here
        await sendEmailToServer(email);
        setIsSubscribeClicked(false);
      } else {
        setNotification((prevState) => ({
          ...prevState,
          type: notiUtils.DANGER,
          message: "Invalid Email!",
          autoCloseTime: "5000",
        }));
      }
    } catch (err) {
      setNotification((prevState) => ({
        ...prevState,
        type: notiUtils.DANGER,
        message: err.message,
        autoCloseTime: "5000",
      }));
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Dream Launcher</title>
      </Head>

      <Modal
        show={isSubscribeClicked}
        modalClosed={() => {
          setIsSubscribeClicked(false);
        }}
        hasBackdrop
      >
        {isSubscribeClicked ? (
          <MailSubscribePopUp value={""} submitHandler={subcribeHandler} />
        ) : null}
      </Modal>

      {/*Banner */}
      <div className={classes.BannerContainer}>
        <div className={classes.Banner}>
          <h1 className={classes.Title}>
            Fly high with da <span className={classes.Highlight}>DREAMERS</span>
            <br />
            reach out to the future{" "}
            <span className={classes.Highlight}>TREASURES</span>
          </h1>
          <h4 className={classes.Subtitle}>
            Bring you the greatest cryptocurrency projects from all blockchains,
            <br />
            selected by reputable and experienced teams.
          </h4>
          <Button
            style="White Rounded SubcribeBtn"
            clicked={() => {
              console.log("Subcribe button clicked!");
              setIsSubscribeClicked(true);
            }}
          >
            Subscribe for Upcoming pools
          </Button>
        </div>
        <div className={classes.ChainLogoSection}>
          <div className={classes.ChainLogo}>
            {Object.keys(CHAIN).map((key) => {
              return (
                <ChainLogo
                  key={key}
                  width="150px"
                  height="35px"
                  symbol={CHAIN[key]}
                />
              );
            })}
          </div>
          <div className={classes.ChainLogoSm}>
            {Object.keys(CHAIN).map((key) => {
              return (
                <ChainLogo
                  key={key}
                  width="40px"
                  height="40px"
                  symbol={`${CHAIN[key]}`}
                  sm={true}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className={classes.HomePage}>
        {/*Live & Upcoming pools */}
        <div className={classes.LiveAndUpcomingPools}>
          <h2>Live and Upcoming Pools</h2>
          {liveAndUpcomingList}
        </div>
        {/*Ended pools */}
        {endedSection}
        {/* Launch project */}
        <div className={classes.LaunchProjectWrapper}>
          <div className={classes.LaunchProject}>
            <div></div>
            <p>
              Fly your <span className={classes.Highlight}>Dream</span> with us?
            </p>
            <p className={classes.SmallHighlight}>
              With <span className={classes.Highlight}>ZERO</span> worry about
              any <span className={classes.RedHightlight}>SERVICE FEE</span>!
            </p>
            <Button
              style="Rounded Big LaunchBtn"
              clicked={() => {
                window.open("https://forms.gle/Kjefq41ShdE4u8tFA");
              }}
            >
              Launch here
            </Button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export async function getStaticProps() {
  const revalidate = 300; // revalidate after 300 seconds
  //get data from contract
  try {
    const pools = await Promise.all([
      getPools(projectStatus.ACTIVE),
      getPools(projectStatus.UPCOMING),
      getPools(projectStatus.ENDED, 3),
    ]);
    if (
      pools[0].results.length == 0 &&
      pools[1].results.length == 0 &&
      pools[2].results.length == 0
    ) {
      revalidate = 1;
    }
    //console.log(pools[1].results)
    const props = {
      activePools: pools[0].results.map((pool) => ({
        id: pool.Id,
        status: "active",
        name: pool.Name,
        chainName: getChainNameById(pool.ChainId),
        imgSrc: pool.LogoUrl,
        StakeAddress: pool.StakeAddress,
        totalRaise: pool.TotalRaise.toString(),
        tokenAmount: pool.TokenAmount.toString(),
        soldAmount: pool.SoldAmount.toString(),
        endTime: pool.EndTime,
        participants: pool.ParticipantAmount,
        maxAllocation: pool.MaxAllocation,
      })),
      upcomingPools: pools[1].results.map((pool) => ({
        id: pool.Id,
        name: pool.Name,
        status: "upcoming",
        imgSrc: pool.LogoUrl,
        chainName: getChainNameById(pool.ChainId),
        totalRaise: pool.TotalRaise.toString(),
        tokenAmount: pool.TokenAmount.toString(),
        beginTime: pool.BeginTime,
        website: pool.Website,
      })),
      endedPools: pools[2].results.map((pool) => ({
        id: pool.Id,
        status: "ended",
        name: pool.Name,
        chainName: getChainNameById(pool.ChainId),
        imgSrc: pool.LogoUrl,
        StakeAddress: pool.StakeAddress,
        totalRaise: pool.TotalRaise.toString(),
        tokenAmount: pool.TokenAmount.toString(),
        soldAmount: pool.SoldAmount.toString(),
        endTime: pool.EndTime,
        participants: pool.ParticipantAmount,
        maxAllocation: pool.MaxAllocation.toString(),
      })),
    };
    return { revalidate, props: { hasError: null, ...props } };
  } catch (error) {
    const errorMessage = error.message;
    return { revalidate: 1, props: { hasError: errorMessage } };
  }
}
