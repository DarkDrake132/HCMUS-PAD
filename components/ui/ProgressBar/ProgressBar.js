import classes from './ProgressBar.module.css'

import { roundUp } from '../../../utility/NumberUtility';

const progressBar = (props) => {
  const current = props.current || 0;
  const total = props.total || 100;
  
  let paddingPercent = (current / total * 100);
  let paddingStyle = {paddingRight: `${100 - paddingPercent}%`};
  let progressInfor = classes.ProgressInforRightPadding;
  if (paddingPercent < 18) {
    paddingStyle = {paddingLeft: '0%'};
    progressInfor = classes.ProgressInforLeftPadding;
  }

  return (
    <div className={classes.ProgressDetail}>
      <div className={progressInfor}>
      <p style={paddingStyle}>
        {roundUp(current / total * 100, 0)}%
      </p>
      </div>
      <div className={classes.ProgressBar}>
        <meter className={classes.Meter} min="0" max="100" value={roundUp(current / total * 100, 0)}></meter>
      </div>
    </div>
  )
}

export default progressBar;