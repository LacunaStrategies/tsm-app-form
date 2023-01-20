/**
 * Delay
 * @dev Creates a "delay" functionality
 * @params [int] ms
 */

const delay = ms => new Promise(res => setTimeout(res, ms));
export default delay