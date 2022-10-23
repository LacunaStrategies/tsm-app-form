/**
 * Trim String
 * @dev Returns a Shortened String
 * @params [string] string, [int] cutStart, [int] cutEnd
 */

 const trimString = (str, cutStart = 5, cutEnd = -4) => {
    return str.slice(0, cutStart) + '...' + str.slice(cutEnd)
}

export default trimString