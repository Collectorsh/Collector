export function nullifyUndefined(obj) {
  const result = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = nullifyUndefined(obj[key]);
      } else {
        result[key] = obj[key];
      }
    } else {
      result[key] = null;
    }
  }
  return result;
}