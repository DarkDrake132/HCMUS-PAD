/**
 * Function for classify displaying 'in' or 'ago' when display time
 * @param {*} time the time input
 * @returns the remaining time with value (integer) and type (string)
 */
export function getRemainingTime(time) {
  const remainingTime = new Date(time * 1000) - new Date();
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  let returnedTime = {
    value: days,
    type: "day(s)",
  };
  if (returnedTime.value === 0) {
    returnedTime = {
      value: Math.floor((remainingTime / (1000 * 60 * 60)) % 24), // convert to hours
      type: "hour(s)",
    };
    //check if hours === 0 or Not
    if (returnedTime.value === 0) {
      returnedTime = {
        value: Math.floor((remainingTime / 1000 / 60) % 60), // convert to minutes
        type: "minute(s)",
      };
    }
  }
  
  return returnedTime;
}

/**
 * function return format remaining time in string
 * @param {the upcoming time} time
 * @returns a <span> with upcoming time
 */
export function getRemainingTimeString(time) {
  const returnedTime = getRemainingTime(time);
  if (returnedTime.value < 0) {
    return returnedTime.value * -1 + " " + returnedTime.type + " ago";
  }
  return "in " + returnedTime.value + " " + returnedTime.type;
}

/**
 * function return format remaining time in string
 * @param {*} time
 * @returns a boolean to check if the time is passed or not
 */
export function isTimePassed(time) {
  const remainingTime = new Date(time * 1000) - new Date();
  return remainingTime < 0;
}

/**
 * 
 * @returns time object
 */
 export const calculateTimeLeft = (time) => {
  let difference = new Date(time * 1000) - new Date();

  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  }

  return timeLeft;
}