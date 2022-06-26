import { useEffect } from "react";

import Modal from "../Modal/Modal";
import Spinner from "../Spinner/Spinner";

import classes from "../Notification/Notification.module.css";

/**
 *
 * @param
 * props.type: type of notification (Success, Warning, Danger)
 * props.content: text content of notification
 * props.closeHandler: function to handle close notification
 * props.autoCloseTime: miliseconds to auto close notification (if it is undefined, user have to close noti by hand)
 * @returns div tag to show notification (return null if props.type is null)
 */
function Notification(props) {
  useEffect(() => {
    if (props.autoCloseTime) {
      const timer = setTimeout(() => {
        props.closeHandler();
      }, props.autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [props.content]);
  let iconType = "";

  //if type is null do not render anything
  if (!props.type) {
    throw new Error("Notification type can not be null");
  }
  switch (props.type) {
    case "Success":
      iconType = "check_circle";
      break;
    case "Warning":
      iconType = "report_problem";
      break;
    case "Danger":
      iconType = "cancel";
      break;
  }

  return (
    <div className={classes.Notification}>
      <div>
        {props.type === "Processing" ? (
          <div className={classes.Spinner}>
            <Spinner type="DoubleRings" classesName="SizeL Secondary"></Spinner>
          </div>
        ) : (
          <span className={"material-icons " + classes[props.type]}>
            {iconType}
          </span>
        )}
        <p>{props.content}</p>
      </div>
      {!props.fixed && (
        <button className={classes.CloseBtn} onClick={props.closeHandler}>
          <span className={"material-icons "}>close</span>
        </button>
      )}
    </div>
  );
}

export default Notification;
