import React, { useState } from "react";

import classes from "./TabBar.module.css";

const TabBar = ({ titleList, showTab, setShowTab, children }) => {
  const activeClass = classes.ActiveTab;
  const hiddenClass = classes.HiddenTab;
  const handleTabPanelToggle = (showTab) => {
    setShowTab(showTab);
  };
  return (
    <div className={classes.TabBar}>
      <div className={classes.Title}>
        {titleList.map((title, index) => {
          return (
            <h3
              key={index}
              className={showTab === index ? activeClass : hiddenClass}
              onClick={() => handleTabPanelToggle(index)}
            >
              {title}
            </h3>
          );
        })}
      </div>
      <div className={classes.Content}>{children}</div>
    </div>
  );
};

export default TabBar;
