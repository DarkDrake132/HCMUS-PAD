import React from "react";

import classes from "./TabPanel.module.css";

const TabPanel = ({ index, showIndex, children }) => {
  if (index === showIndex) {
    return children;
  }
  return null;
};

export default TabPanel;
