import classes from "./ItemHead.module.css";
import Card from "../../ui/Card/Card";

function ItemHead(props) {
  switch (props.status) {
    case "owner":
    case "upcoming":
      return (
        <div className={classes.ItemHead}>
          <Card>
            <div className={classes.FourColumns}>
              {/* render 4 h3 tag  */}
              {props.header.map((item, index) => (
                <h3 key={index}>{item}</h3>
              ))}
            </div>
          </Card>
        </div>
      );
    default:
      return (
        <div className={classes.ItemHead}>
          <Card>
            <div className={classes.FiveColumns}>
              {/* render 5 h3 tag  */}
              {props.header.map((item, index) => (
                <h3 key={index}>{item}</h3>
              ))}
            </div>
          </Card>
        </div>
      );
  }
}

export default ItemHead;
