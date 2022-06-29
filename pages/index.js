import Head from "next/head";

import { Fragment, useState, useContext } from "react";
import { useRouter } from "next/router";

import { NotificationContext } from "../context/NotificationContext";

// MUI COMPONENTS
import MuiButton from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import Grid from "@mui/material/Grid";

import { keyframes } from "@mui/system";

// NEXT COMPONENTS
import Image from "next/image";

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

const moveUpDown = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50px); }
`;

const HomeHero = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 10 }}>
      <Grid container>
        <Grid item xs={8} container rowSpacing={4} direction="column">
          <Grid item>
            <Typography
              variant="h1"
              sx={{
                background: "red",
                backgroundImage:
                  "linear-gradient(to right, #5433ff, #20bdff, #a5fecb)",
                backgroundSize: "100%",
                backgroundRepeat: "repeat",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                MozBackgroundClip: "text",
                MozTextFillColor: "transparent",
              }}
              fontWeight={700}
            >
              Get early access to the ideas of tomorrow
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" fontWeight={400} color="text.secondary">
              Highly-vetted ideas and teams you can trust. Supported by
              industry-leading creators and funds.
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{
              WebkitAnimation: `${moveUpDown} 4s ease-in-out infinite alternate`,
              animation: `${moveUpDown} 4s ease-in-out infinite alternate`,
            }}
          >
            <Image
              src={
                "https://polkastarter.com/_next/image?url=%2Fillustrations%2Fhero%402x.png&w=1920&q=75"
              }
              alt=""
              width={400}
              height={400}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

function MailSubscribePopUp(props) {
  const [value, setValue] = useState(props.value);

  const changeHandler = (e) => {
    let newValue = e.target.value;
    setValue(newValue);
  };

  return (
    <Card style="Tertiary">
      <div className={classes.EditPopup} style={{ background: "#001E3C" }}>
        <h3>Subscribe for upcoming pool</h3>
        <TextField
          placeholder="example@gmail.com"
          fullWidth
          sx={{ mb: 2 }}
          onChange={changeHandler}
          value={value}
        />
        <MuiButton
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          onClick={(event) => props.submitHandler(event, value)}
        >
          Subscribe
        </MuiButton>
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
    <p
      className={classes.EmptyAnnounce1}
      style={{ color: "grey", textTransform: "none" }}
    >
      This list is empty !!!
    </p>
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
        <Typography variant="h4" color="gray" sx={{ textAlign: "center" }}>
          This list is empty !!!
        </Typography>
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
          <MuiButton
            variant="contained"
            color="primary"
            size="large"
            sx={{
              alignSelf: "center",
              justifySelf: "center",
              mx: "auto",
              mt: 3,
            }}
            onClick={RedirectUserToPools}
          >
            View more
          </MuiButton>
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
        <title>HCMUSPad</title>
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
      <HomeHero />
      <MuiButton
        variant="contained"
        sx={{ width: 400, justifySelf: "center", mx: "auto" }}
        size="large"
        onClick={() => {
          setIsSubscribeClicked(true);
        }}
      >
        Subscribe for Upcoming pools
      </MuiButton>
      <div className={classes.HomePage}>
        {/*Live & Upcoming pools */}
        <div className={classes.LiveAndUpcomingPools}>
          <h2 style={{ color: "white" }}>Live and Upcoming Pools</h2>
          {liveAndUpcomingList}
        </div>
        {/*Ended pools */}
        {endedSection}
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
