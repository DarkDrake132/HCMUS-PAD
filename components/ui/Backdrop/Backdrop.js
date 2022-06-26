import React from 'react'

import classes from './Backdrop.module.css'
/**
 * 
 * @param 
 * props.show: show backdrop or not (true or false)
 * @returns div tag to show backdrop
 */
const BackDrop = (props) => {
  return (props.show) ? 
    <div className={classes.Backdrop} onClick={props.click}></div> : null
};


export default BackDrop;

