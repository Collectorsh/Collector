export function displayName(user) {
  return user?.name || user?.username?.replaceAll("_", " ");
}