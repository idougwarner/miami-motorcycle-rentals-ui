export function mergeArrayWithObject<T>(arr: T[], obj: { [key: string]: any }): T[] {
  // Sort the keys in ascending order
  const sortedKeys = Object.keys(obj).sort((a, b) => parseInt(a) - parseInt(b));

  sortedKeys.forEach((key) => {
    const index = parseInt(key) - 1;
    if (index < arr.length) {
      arr[index] = obj[key];
    } else {
      arr.push(obj[key]);
    }
  });

  return arr;
}