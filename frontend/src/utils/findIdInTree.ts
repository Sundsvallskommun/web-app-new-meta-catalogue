/**
 * @param arr The object tree array
 * @param id id to search for
 * @param nestingKey Specifying which key to process recursively.
 * @param idProperty Specifying another object property than 'id' to match for.
 * @returns null | object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const findIdInTree = (arr: any[], id: string | number, nestingKey: string, idProperty?: string) =>
  arr.reduce((a, item) => {
    const _id = idProperty ? idProperty : 'id';
    if (a) return a;
    if (item[_id] === id) return item;
    if (item[nestingKey]) return findIdInTree(item[nestingKey], id, nestingKey, idProperty);
  }, null);
