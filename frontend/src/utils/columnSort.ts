/**
 * Sorting function for table columns
 *
 * Handles string, number, (null = '', undefined = '')
 * @param a First value (string gets trim().toLowerCase())
 * @param b Second value (string gets trim().toLowerCase())
 * @param asc Whether to sort ascending or descending
 * @returns -1, 0 or 1
 */
export const columnSort = (
  a: string | number | null | undefined,
  b: string | number | null | undefined,
  asc: 1 | -1
) => {
  if (a === undefined || a === null) a = '';
  if (b === undefined || b === null) b = '';
  if (typeof a === 'string') {
    a = a.trim().toLowerCase();
  }
  if (typeof b === 'string') {
    b = b.trim().toLowerCase();
  }
  return a > b ? asc : a < b ? -1 * asc : 0;
};
