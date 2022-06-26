import classes from '../Input/Input.module.css'

/**
 * 
 * @param 
 * props.style: style of input 
 * props.value: value of input
 * props.changed: function handle change input
 * props.placeholder: placeholder of input
 * @returns input component
 */
function Input(props) {
  const inputType = props.style
  let inputTypeArr = []
  if (inputType) {
    inputTypeArr = inputType.split(' ')
  }
  let calledClasses =""
  calledClasses += classes.Input
  for (let type in inputTypeArr) {
    calledClasses += ' ' + classes[inputTypeArr[type]]
  }
  return (
      <input
        type={props.type}
        className={calledClasses}
        value={props.value}
        onChange={props.changed} 
        placeholder={props.placeholder}
      >
        {props.children}
      </input>
  )
}

export default Input;