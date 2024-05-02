/**
 * Calculates the difference in position between an HTML element under a container div
 * and the top of the container.
 *
 * @param {element} container - The element of the container div.
 * @param {element} element - The element of the element under the container.
 * @returns {number | null} - The difference in position between the top of the element
 * and the top of the container. Returns `null` if either the container or element is not found.
 *
 * @example
 * const positionDifference = calculatePositionDifference(containerElement, element);
 *
 * if (positionDifference !== null) {
 *   console.log('Position difference:', positionDifference);
 * } else {
 *   console.error('Container or element not found');
 * }
 */
export function calculatePositionDifference(container, element) {
  if (!container || !element) {
    console.error('Container or element not found');
    return null;
  }

  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const difference = elementRect.top - containerRect.top;

  return difference;
}
