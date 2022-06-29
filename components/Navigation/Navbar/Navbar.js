// MUI COMPONENTS
import Typography from "@mui/material/Typography";

import NavLink from "../../ui/NavLink/NavLink";

import classes from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={classes.Nav}>
      <ul className={classes.NavList}>
        <li className={classes.NavItem}>
          <NavLink href="/pools">
            <div className={classes.NavLink}>
              <a className={classes.aTag}>
                <Typography variant="h5" color="white">
                  Pools
                </Typography>
              </a>
              <div></div>
            </div>
          </NavLink>
        </li>
        <li className={classes.NavItem}>
          <NavLink href="/account">
            <div className={classes.NavLink}>
              <a className={classes.aTag}>
                <Typography variant="h5" color="white">
                  Account
                </Typography>
              </a>
              <div></div>
            </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
