export function truncate(str, n = 4) {
  return (str?.length > n) ? str.substr(0, n) + '...' + str.substr(str.length - n) : str;
}