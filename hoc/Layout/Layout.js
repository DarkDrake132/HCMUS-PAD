import Header from "../../components/Header/Header";

import classes from "./Layout.module.css";

function Layout(props) {
  return (
    <div className={classes.Layout}>
      <Header />
      {props.children}
    </div>
  );
}
export default Layout;
