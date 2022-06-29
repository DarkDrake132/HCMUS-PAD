import Image from "next/image";

import Card from "../../ui/Card/Card";
import Button from "../../ui/Button/Button";
import ProgressBar from "../../ui/ProgressBar/ProgressBar";

import { useRouter } from "next/router";

import classes from "./ItemListData.module.css";

// MUI COMPONENTS
import MuiButton from "@mui/material/Button";

const ItemListData = (props) => {
  const router = useRouter();
  const data = props.data;

  function handleCardClick() {
    // if(data.status === "upcoming") {
    //   window.open(data.website)
    // }
    // else if (data.status !== "owner") {
    //   router.push(`/${data.id}`);
    // }
    router.push(`/${data.id}`);
  }

  const PoolLogo = (
    <div className={classes.PoolLogo}>
      <Image src={data.imgSrc} width={100} height={100} alt={data.poolName} />
    </div>
  );

  const PoolData = (
    <div className={classes[`PoolData${Object.keys(data.display).length}Col`]}>
      {Object.entries(data.display).map((entry, index) => {
        {
          /* Check if object key (entry[0]) is progress 
        then display progress component, 
        else display object value (entry[1]) into a <p> tag */
        }
        let displayInfo = <p>{entry[1]}</p>;
        if (entry[0] === "progress") {
          displayInfo = (
            <ProgressBar current={entry[1].current} total={entry[1].total} />
          );
        }
        //return div element contain display information
        return (
          <div key={index} className={classes[entry[0]]}>
            {displayInfo}
          </div>
        );
      })}
    </div>
  );

  const displayButtons = data.buttons;
  const CustomButton = displayButtons && (
    <div className={classes.CustomButton}>
      {displayButtons.map((button, index) => (
        <MuiButton
          key={index}
          onClick={button.clicked}
          variant="contained"
          size="large"
        >
          {button.content === "Edit" ? (
            <span className={"material-icons "}>edit</span>
          ) : (
            button.content
          )}
        </MuiButton>
      ))}
    </div>
  );

  return (
    <li className={classes.Item} onClick={() => handleCardClick()}>
      <Card style="HoverScaleUp">
        <div className={classes.PoolItem}>
          {PoolLogo}
          {PoolData}
          {CustomButton}
        </div>
      </Card>
    </li>
  );
};

export default ItemListData;
