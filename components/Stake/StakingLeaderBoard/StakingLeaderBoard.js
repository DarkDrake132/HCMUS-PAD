import { useEffect, useState } from "react";

import classes from "./StakingLeaderBoard.module.css";

import {
  getStakers,
  getAddressStakingInfo
} from "../../../contract/services/client/stake";

const StakingLeaderBoard = (props) => {
  const [stakers, setStakers] = useState([]);
  useEffect(() => {
    const arr = [];
    getStakers(props.stakeAddress).then(async (stakersArray) => {
      for (let i = 0; i < stakersArray.length; i++) {
        const info = await getAddressStakingInfo(props.stakeAddress,stakersArray[i]);
        arr.push({
          address: stakersArray[i],
          ...info
        });
      }
      const sortArr = arr.sort((staker1, staker2)=>{ staker1.point > staker2.point })
      setStakers(sortArr);
    });
  }, []);

  const list = stakers.map((user, index) => {
    return (
      <li className={classes.ListItem} key={index}>
        <p className={classes.Address}>{user.address}</p>
        <div className={classes.Point}>
          <p>{user.point.toLocaleString()}</p>
          <p>/ {user.maxPoint.toLocaleString()} (Pts)</p>
        </div>
      </li>
    );
  });

  if (list.length == 0) {
    return <p className={classes.EmptyList}>This list is empty !!!</p>;
  }
  return (
    <div>
      <ul className={classes.StakingList}>{list}</ul>
      <p className={classes.WarningText}> Please reload page to update newest Staking Leader Board</p>
    </div>
  )
};

export default StakingLeaderBoard;
