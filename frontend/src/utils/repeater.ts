/**
 * Repeats the execution of a function for a specified number of times with a given interval.
 * @param {Function} func - The function to be repeated.
 * @param {number} times - The number of times to repeat the function.
 * @param {number} interval - The interval (in milliseconds) between each execution of the function.
 */
export const repeater = async function (func, times, interval) {
  const ID = window.setInterval(
    (function (times) {
      return function () {
        if (--times <= 0) window.clearInterval(ID);
        func();
      };
    })(times),
    interval
  );
  return ID;
};
