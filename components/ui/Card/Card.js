import React from "react";

import classes from "./Card.module.css";

/**
 * 
 * @param 
 * props.style: style of card (default is border blue)
 * @returns a div component with border
 */
const Card = (props) => {
  const cardType = props.style;
  let cardTypeArr = [];
  if (cardType) {
    cardTypeArr = cardType.split(' ');
  }
  let calledClasses = "";
  calledClasses += classes.Card;
  for (let type in cardTypeArr) {
    calledClasses += ' ' + classes[cardTypeArr[type]];
  }
  return (
    <div className={calledClasses}>
      {props.children}
    </div>
  );
};

export default Card;
