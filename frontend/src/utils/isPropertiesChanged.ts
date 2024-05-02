/**
 *
 * @param oldObject The object to check against
 * @param newObject Object to check for changes
 * @returns
 */
export const isPropertiesChanged = <T>(oldObject: T, newObject: Partial<T> | T): boolean => {
  let isChanged = false;
  Object.keys(newObject).map((key) => {
    if (oldObject[key] !== newObject[key]) {
      isChanged = true;
    }
  });
  return isChanged;
};
