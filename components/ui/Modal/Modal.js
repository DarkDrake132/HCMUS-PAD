import React, { Fragment } from 'react'

import classes from './Modal.module.css'
import Backdrop from '../Backdrop/Backdrop'


/**
 * 
 * @param
 * props.show: show Modal or not (true or false)
 * props.hasBackdrop: has backdrop or not (true or false)
 * props.modalClosed: function to handle close when click outside of modal
 * props.position: position of Modal in screen
 *              -default: middle
 *              -RightBottom right bottom of the screen
 * @returns a modal with backdrop
 */
const Modal = props => {
  let hasBackdrop = props.hasBackdrop;
  let classType = classes.Modal;
  let showTransform = 'translateY(0)';
  let hideTransform = 'translateY(-100vh)';

  //when modal has backdrop, show and hide backdrop base on props.show
  if (props.hasBackdrop){
    hasBackdrop = props.show;
  }

  //set position when props.position not null
  if (props.position) {
    classType += ' ' + classes[props.position];
    //Check position type for changing transform method
    if (props.position.toString().includes('RightBottom')){
      showTransform = 'translateX(0)';
      hideTransform = 'translateX(50vw)';
    }
  } else {//use default position when props.position is null
    classType += ' ' + classes.DefaultPosition;
  }

  return (
    <Fragment>
      <Backdrop show={hasBackdrop} click={props.modalClosed} />
      <div className={classType} style = {{
        transform: props.show ? showTransform : hideTransform,
        opacity: props.show ? 1 : 0
      }}>
        {props.children}
      </div>
    </Fragment>
  )
}

export default React.memo(Modal, 
  (prevProps, nextProps) => prevProps.show === nextProps.show && nextProps.children === prevProps.children
)