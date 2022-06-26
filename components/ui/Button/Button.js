import { Fragment } from "react"

import Spinner from '../Spinner/Spinner'

import classes from './Button.module.css'


/**
 * 
 * @param
 * props.style: string of style for button (Ex: style="Primary Squared")
 * props.loading: true or false (for display spinner)
 * props.disabled: true or false (for disable button)
 * props.type: type of button (button, submit, reset)
 * @returns button component
 */
function Button(props) {
  //Get style of button
  const btnStyle = props.style;
  let btnStyleArr = [];

  if (btnStyle) {
    btnStyleArr = btnStyle.split(' ')
  }

  //default style of button
  let calledClasses = classes.Button;

  for (let item in btnStyleArr) {
    calledClasses += ' ' + classes[btnStyleArr[item]];
  }
  //add disable style
  if (props.disabled) {
    calledClasses += ' ' + classes.Disable;
  }

  let children = props.children;
  if (props.loading) {
    children = (
      <Fragment>
        <Spinner classesName="SizeS White"></Spinner>
        <span>{props.children}</span>
      </Fragment>
    );
    calledClasses += ' ' + classes.Loading;
  }

  return (
    <button
        className={calledClasses}
        onClick={props.clicked}
        disabled={props.disabled}
        type={props.type || 'button'}
    >
        {children}
    </button>
  )
}

export default Button