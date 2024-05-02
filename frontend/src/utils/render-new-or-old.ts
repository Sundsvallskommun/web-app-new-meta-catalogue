/**
 * @param newValue
 * @param oldValue
 * @returns new newValue if assigned, otherwise oldValue. Fallbacks to empty string
 */
export function renderNewOrOld(newValue, oldValue) {
  if (newValue === 'Bortkopplad') return '';
  if (newValue === '-1') return '';
  if (newValue) return `${newValue}`;
  if (oldValue) return `${oldValue}`;
  return '';
}
