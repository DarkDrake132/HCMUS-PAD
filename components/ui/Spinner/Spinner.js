import classes from '../Spinner/Spinner.module.css'


/**
 * 
 * @param 
 * props.type: type of Spinner (DoubleRings, when type is null or incorrect return DefaultSpinner)
 * props.classesName: names of Spinner class include: 
 *                  + Color: White, Secondary, Accent
 *                  + Size: SizeXL, SizeL, SizeS
 *                (return default css with Secondary color and SizeL when classesName is null or undefined)
 * @returns Spinner 
 */
const Spinner = (props) => {
  //Split classesName to array
  let classArr = [];
  if (props.classesName) {
    classArr = props.classesName.split(' ');
  }

  //Get type of classes import from css and add in callClasses 
  let calledClasses = "";
  for (let type in classArr) {
    calledClasses += ' ' + classes[classArr[type]];
  }
  //Default spinner
  const DefaultSpinner = (
    <div className={classes.DefaultSpinner + ' ' + calledClasses}>
      <div></div>
    </div>
  )
  //Double Rings spinner
  const DoubleRings = (
    <div className={classes.DoubleRings + ' ' + calledClasses}>
      <div></div>
    </div>
  )
  //Switch type and return spinner
  switch (props.type) {
    case "DoubleRings":
      return DoubleRings;
    default:
      return DefaultSpinner;
  }
  
}

export default Spinner