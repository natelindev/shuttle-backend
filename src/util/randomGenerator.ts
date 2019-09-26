import consts from './consts';

/**
 * Generate a random decimal, integer or string
 * @param rngOption an option indicate the type of random value it generates
 * @param max upper limit of the generated number, length of string
 * @param min lower limit of the generated number (optional, defaults to 0)
 * @returns a random value that fulfills the above requirements
 */
export default (rngOption, max, min = 0) => {
  let result;
  switch (rngOption) {
    case consts.rngOption.decimal:
      result = Math.random() * (max - min) + min;
      break;
    case consts.rngOption.integer:
      result =
        Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
        Math.ceil(min);
      break;
    case consts.rngOption.string:
      result = Array(max)
        .fill(0)
        .map(() =>
          Math.random()
            .toString(36)
            .charAt(2)
        )
        .join('');
      break;
    default:
      result = null;
      break;
  }
  return result;
};
