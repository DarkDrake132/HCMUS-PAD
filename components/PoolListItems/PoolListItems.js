import { Fragment } from "react";

import ItemHead from "./ItemHead/ItemHead";
import ItemList from "./ItemList/ItemList";

import Spinner from "../ui/Spinner/Spinner";

import classes from "./PoolListItems.module.css";

// MUI COMPONENTS
import Typography from "@mui/material/Typography";

function PoolListItems(props) {
  let PoolList;
  if (props.loading) {
    PoolList = (
      <div className={classes.LoadingMessage}>
        <Spinner classesName="SizeS" />
        <p className={classes.NotificationText}>Loading...</p>
      </div>
    );
  } else {
    PoolList = (
      <Typography variant="h6" color="gray" sx={{ textAlign: "center" }}>
        This list is empty !!!
      </Typography>
    );
    if (props.data?.length > 0) {
      PoolList = (
        <Fragment>
          <ItemHead status={props.status} header={props.header} />
          <ItemList
            status={props.status}
            data={props.data}
            fetch={props.fetch}
            hasMore={props.hasMore}
          />
        </Fragment>
      );
    }
  }
  return (
    <div className={classes.ListItems}>
      <Typography variant="h4">{props.title}</Typography>
      {PoolList}
    </div>
  );
}

export default PoolListItems;
