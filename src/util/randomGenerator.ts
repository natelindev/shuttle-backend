/**
 * Enum for random generator options.
 * @readonly
 * @enum {string}
 */
export const enum rngOption {
  /** @member {string} */
  /** option for random decimal, like 3.14, 1.23 */
  decimal = 'decimal',
  /** @member {string} */
  /** option for random integer, like 42, 3 */
  integer = 'integer',
  /** @member {string} */
  /** option for random alphaNum string, like adov23lj,u9taldfz */
  string = 'string'
}

/**
 * Generate a random decimal, integer or string
 * @param {rngOption} option an option indicate the type of random value it generates
 * @param {number} max upper limit of the generated number, length of string
 * @param {number} min lower limit of the generated number (optional, defaults to 0)
 * @returns {number|string} a random value that fulfills the above requirements
 */
export default (option: rngOption, max: number, min: number = 0): number | string => {
  let result;
  switch (option) {
    case rngOption.decimal:
      result = Math.random() * (max - min) + min;
      break;
    case rngOption.integer:
      result = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
      break;
    case rngOption.string:
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
