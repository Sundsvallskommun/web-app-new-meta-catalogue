/**
 * @param arr The object tree array
 * @param query query to search for
 * @param nestingKey Specifying which key to process recursively
 * @param properties Specifying array of properties to match for
 */
export const findInPropertiesInTree = <T>(arr: T[], query: string | number, nestingKey: string, properties: string[]) =>
  arr.reduce((a, item) => {
    const foundMatch = properties.some((property) =>
      item[property]?.toLowerCase().includes(query.toString().toLowerCase())
    );
    if (foundMatch) {
      a.push(item);
    }
    if (item[nestingKey]) {
      return a.concat(findInPropertiesInTree(item[nestingKey], query, nestingKey, properties));
    }
    return a;
  }, []);
