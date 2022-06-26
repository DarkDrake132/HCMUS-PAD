import Head from "next/head";

import { useState } from "react";
import Big from "big.js";

import PoolListItems from "../components/PoolListItems/PoolListItems";
import ProgressBar from "../components/ui/ProgressBar/ProgressBar";
import Input from "../components/ui/Input/Input";

import classes from "../styles/Pools.module.css";

import { getRemainingTimeString } from "../utility/DateUtility";
import { numberFormatter } from "../utility/NumberUtility";

import { getPools } from "../contract/services/server/pool";
import * as projectStatus from "../server/data-type/projectStatus";
import { getChainNameById } from "../contract/services/client/connection";

const ENDED_POOL_AMOUNT = 5;

function Pools(props) {
  const [endedPools, setEndedPools] = useState({
    data: props.endedPools?.map((pool) => ({
      id: pool.id,
      status: "ended",
      imgSrc: pool.imgSrc,
      display: {
        progress: {
          current: pool.currentToken,
          total: pool.tokenAmount,
        },
        network: pool.network,
        endTime: getRemainingTimeString(pool.endTime),
        moneyRaise: `$${numberFormatter(pool.moneyRaise)}`,
      },
    })),
    page: {
      amount: ENDED_POOL_AMOUNT,
      step: ENDED_POOL_AMOUNT,
    },
    hasMore: true,
  });

  const activePools = props.activePools?.map((pool) => ({
    id: pool.id,
    poolName: pool.poolName,
    status: pool.status,
    imgSrc: pool.imgSrc,
    display: {
      progress: {
        current: pool.currentToken,
        total: pool.tokenAmount,
      },
      network: pool.network,
      endTime: getRemainingTimeString(pool.endTime),
      moneyRaise: `$${numberFormatter(pool.moneyRaise)}`,
    },
  }));

  const upcomingPools = props.upcomingPools?.map((pool) => {
    return {
      id: pool.id,
      website: pool.website,
      poolName: pool.poolName,
      status: pool.status,
      imgSrc: pool.imgSrc,
      display: {
        network: pool.network,
        beginTime: getRemainingTimeString(pool.beginTime),
        moneyRaise: `$${numberFormatter(pool.moneyRaise)}`,
      },
    };
  });

  const fetchPools = () => {
    fetch(
      `/api/pools/ended?amount=${endedPools.page.amount}&step=${endedPools.page.step}`
    )
      .then((res) => {
        res
          .json()
          .then((data) => {
            const fetchedEndedPools = data.results?.map((pool) => {
              return {
                id: pool.Id,
                poolName: pool.Name,
                status: "ended",
                imgSrc: pool.LogoUrl,
                display: {
                  progress: {
                    current: pool.SoldAmount,
                    total: pool.TokenAmount,
                  },
                  network: "ETH",
                  endTime: getRemainingTimeString(pool.EndTime),
                  moneyRaise: `$${numberFormatter(pool.MoneyRaise)}`,
                },
              };
            });
            if (data.results?.length > 0) {
              setEndedPools((prevState) => ({
                data: prevState.data.concat(fetchedEndedPools),
                page: {
                  ...prevState.page,
                  step: prevState.page.step + prevState.page.amount,
                },
                hasMore: true,
              }));
            } else {
              setEndedPools({ ...endedPools, hasMore: false });
            }
          })
          .catch((err) => {
            console.error(err);
            setEndedPools((prevState) => ({
              ...prevState,
              hasMore: false,
            }));
          });
      })
      .catch((err) => {
        console.log(err);
        setEndedPools((prevState) => ({
          ...prevState,
          hasMore: false,
        }));
      });
  };
  return (
    <div className={classes.Page}>
      <Head>
        <title>Pools</title>
      </Head>
      {/* <div className={classes.SearchBar}>
        <span className={"material-icons " + classes.SearchIcon}>search</span>
        <Input
          style="Search"
          placeholder="Search by project name or contract address"
        ></Input>
      </div> */}
      <PoolListItems
        title="Active Pools"
        status="active"
        header={props.activeHeader}
        data={activePools}
      />
      <PoolListItems
        title="Upcoming Pools"
        status="upcoming"
        header={props.upcomingHeader}
        data={upcomingPools}
      />
      <PoolListItems
        title="Ended Pools"
        status="ended"
        header={props.endedHeader}
        data={endedPools.data}
        fetch={fetchPools}
        hasMore={endedPools.hasMore}
      />
    </div>
  );
}

export async function getStaticProps() {
  const activeHeader = ["Pool", "Progress", "Network", "Ending", "Total Raise"];
  const upcomingHeader = ["Pool", "Network", "Starting", "Total Raise"];
  const endedHeader = [
    "Pool",
    "Progress",
    "Network",
    "Launched",
    "Total Raise",
  ];

  const revalidate = 300; // revalidate after 300 seconds
  //get data from contract
  try {
    const pools = await Promise.all([
      getPools(projectStatus.ACTIVE),
      getPools(projectStatus.UPCOMING),
      getPools(projectStatus.ENDED, ENDED_POOL_AMOUNT, 0),
    ]);
    if (pools[0].results.length == 0 && pools[1].results.length == 0 && pools[2].results.length == 0) {
      revalidate = 1;
    }
    //console.log('upcoming pools ', pools[1].results)
    const props = {
      activePools: pools[0].results.map((pool) => ({
        id: pool.Id,
        poolName: pool.Name,
        status: "active",
        imgSrc: pool.LogoUrl,
        network: getChainNameById(pool.ChainId),
        currentToken: pool.SoldAmount.toString(),
        tokenAmount: pool.TokenAmount.toString(),
        endTime: pool.EndTime,
        moneyRaise: pool.MoneyRaise,
      })),
      upcomingPools: pools[1].results.map((pool) => ({
        id: pool.Id,
        website: pool.Website,
        poolName: pool.Name,
        status: "upcoming",
        imgSrc: pool.LogoUrl,
        network: getChainNameById(pool.ChainId),
        tokenAmount: pool.TokenAmount.toString(),
        beginTime: pool.BeginTime,
        moneyRaise: pool.MoneyRaise,
        totalRaise: pool.TotalRaise.toString(),
      })),
      endedPools: pools[2].results.map((pool) => ({
        id: pool.Id,
        poolName: pool.Name,
        status: "ended",
        imgSrc: pool.LogoUrl,
        network: getChainNameById(pool.ChainId),
        currentToken: pool.SoldAmount.toString(),
        tokenAmount: pool.TokenAmount.toString(),
        endTime: pool.EndTime,
        moneyRaise: pool.MoneyRaise,
      })),
      activeHeader,
      upcomingHeader,
      endedHeader,
    };
    return { revalidate, props: { hasError: null, ...props } };
  } catch (error) {
    const errorMessage = error.message;
    return { revalidate: 1, props: { hasError: errorMessage } };
  }
}
export default Pools;
