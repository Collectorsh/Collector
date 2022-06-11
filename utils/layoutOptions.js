export function borderWidth(user) {
  if (!user) return "0.5rem";

  return user.border ? "0.5rem" : "none";
}

export function shadow(user) {
  if (!user) return "0 1px 2px 0 rgb(0 0 0 / 0.05)";

  return user.shadow ? "0 2px 4px 0 rgb(0 0 0 / 0.05)" : "none";
}

export function rounded(user) {
  if (!user) return "0";

  if (user.rounded && !user.description && !user.names) {
    return "15px";
  } else if (user.rounded && (user.description || user.names)) {
    return "15px 15px 0 0";
  } else {
    return "0";
  }
}

export function descriptionRounded(user) {
  if (!user) return "0";

  return user.rounded ? "0 0 15px 15px" : "0";
}

export function descriptionPadding(user) {
  if (!user) return "0.4rem";

  return user.rounded ? "0.6rem" : "0.5rem";
}
