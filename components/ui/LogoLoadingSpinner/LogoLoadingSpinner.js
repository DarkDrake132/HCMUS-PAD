import classes from './LogoLoadingSpinner.module.css'


const LogoLoadingSpinner = (props) => {
  const LogoInsideSrc = '/logo/LogoInside.svg';
  return (
    <div className={classes.Wrapper}>
      <div className={classes.Logo}>
        <img className={classes.LogoInside} src={LogoInsideSrc} ></img>
      </div>
      <div className={classes.Loading}>
        <p>Loading</p>
        <div className={classes.DotTyping}></div>
      </div>
    </div>
  )
}

export default LogoLoadingSpinner