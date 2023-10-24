export function updateObjectWithArray<T>(arr: any[], obj: { [key: string]: T }): { [key: string]: T } {
  const keys = Object.keys(obj);
  
  keys.forEach((key, index) => {
    if (arr[index] !== undefined) {
      obj[key] = arr[index];
    }
  });

  return obj;
}