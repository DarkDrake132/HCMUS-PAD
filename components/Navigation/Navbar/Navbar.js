import NavLink from "../../ui/NavLink/NavLink";

import classes from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={classes.Nav}>
      <ul className={classes.NavList}>
        <li className={classes.NavItem}>
          <NavLink href="/pools">
            <div className={classes.NavLink}>
              <a className={classes.aTag}>Pools</a>
              <div></div>
            </div>
          </NavLink>
        </li>
        <li className={classes.NavItem}>
          <NavLink href="/account">
            <div className={classes.NavLink}>
              <a className={classes.aTag}>Account</a>
              <div></div>
            </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
