/**
 * Prevent event bubbling.
 *
 * @param e React.MouseEvent|Event
 * @return {void}
 */
export const preventEvents = (e: React.MouseEvent|Event): void => {
  e.preventDefault();
  e.stopPropagation();
}
