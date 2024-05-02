/**
 * @param o The object tree or array of object trees
 * @param remappedKeys Map of key pairs to remap.
 * @param recursiveArray Specifying which key to process recursively.
 */
export function refitKeys<T extends Array<{ [key: string]: any }> | { [key: string]: any }>(
  o: T,
  remappedKeys,
  recursiveArray: string,
  addKeys = new Map(),
): T {
  if (o === null || typeof o !== 'object') {
    return o;
  }
  if (Array.isArray(o)) {
    return o.map(o => refitKeys(o, remappedKeys, recursiveArray, addKeys)) as T;
  }

  const build = {};
  for (const key in o) {
    let destKey = remappedKeys.get(key) || key;
    let value = o[key];
    if (typeof value === 'object' && key == recursiveArray) {
      value = refitKeys(value, remappedKeys, recursiveArray, addKeys);
    }
    if (typeof destKey === 'function') {
      const keyValue = destKey(value);
      destKey = keyValue[0];
      value = keyValue[1];
    }
    build[destKey] = value;
  }

  const addKeysArr = Array.from(addKeys.keys());
  if (addKeysArr.length > 0) {
    addKeysArr.forEach((key: string) => {
      let value = addKeys.get(key);
      if (typeof value === 'function') {
        value = value(build);
      }
      build[key] = value;
    });
  }
  return build as T;
}
