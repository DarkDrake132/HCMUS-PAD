import { useRef } from 'react';
import classes from './Tooltip.module.css'

function Tooltip({ children, tooltipText }) {
    // useRef to prevent re-render
  const tipRef = useRef(null);

  // hover
  function handleMouseEnter() {
    tipRef.current.style.opacity = 1;
    tipRef.current.style.marginTop = '20px';
  }
  // move mouse out
  function handleMouseLeave() {
    tipRef.current.style.opacity = 0;
    tipRef.current.style.marginTop = '0px';
  }
  return (
    <div
      className={classes.Tooltip}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={classes.TooltipRef} ref={tipRef}>
        {tooltipText}
      </div>
      {children}
    </div>
  );
}

export default Tooltip;