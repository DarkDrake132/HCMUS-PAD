export const isNumeric = (num) => {
  return !isNaN(parseFloat(num)) && isFinite(num);
};

/**
 * 
 * @param {number to format} num 
 * @param {number of digit to round} digit (default is 4)
 * @returns number after round up
 */
export const roundUp = (num, digit = 4) => {
  return (
    Math.round(parseFloat((num * Math.pow(10, digit)).toFixed(digit))) / Math.pow(10, digit)
  );
};

export const numberFormatter = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num;
}

export const BigNumToNormal = (BN) => {
  return Math.floor(BN / 10**18);
}