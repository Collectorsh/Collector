export function nullifyUndefinedObj(obj) {
  const result = {};
  for (const key in obj) {
    if (obj[key] !== undefined) {
      if (Array.isArray(obj[key])) { 
        result[key] = nullifyUndefinedArr(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = nullifyUndefinedObj(obj[key]);
      } else {
        result[key] = obj[key];
      }
    } else {
      result[key] = null;
    }
  }
  return result;
}

export function nullifyUndefinedArr(arr) { 
  return arr.map((item) => {
    if (Array.isArray(item)) { 
      return nullifyUndefinedArr(item);
    } else if (typeof item === 'object' && item !== null) {
      return nullifyUndefinedObj(item);
    } else {
      return item;
    }
  });
}