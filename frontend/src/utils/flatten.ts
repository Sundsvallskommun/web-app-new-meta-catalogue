/**
 *
 * @param xs Tree to flatten
 * @param childSelector Childselector function, e.g. (x) => x.childProperty
 * @param parent Initial parent
 * @param mod Modifier function to change object properties
 * @returns An array of objects
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function flatten(xs, childSelector, parent, mod = (x, parent) => x) {
  return xs.reduce((acc, x) => {
    acc = acc.concat(mod(x, parent));
    const children = childSelector(x);
    if (children) {
      acc = acc.concat(flatten(children, childSelector, x, mod));
    }
    return acc;
  }, []);
}
