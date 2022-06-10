export function pluralize(username) {
  let last = username.slice(-1);
  if (last.toLowerCase() === "s") {
    return username;
  } else {
    return `${username}'s`;
  }
}
