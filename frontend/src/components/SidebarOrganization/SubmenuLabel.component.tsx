interface SubmenuLabelProps {
  label: React.ReactNode;
  /** The text MenuVertical builds the submenu id from. Must be unique and must not change with the filters */
  children: string;
}

/**
 * MenuVertical keys submenus by the text in their button, so a label that changes with the
 * Visa/sök filters remounts the submenus and closes the tree. This shows the label but gives
 * MenuVertical a stable text to read.
 */
export const SubmenuLabel = ({ label }: SubmenuLabelProps) => <>{label}</>;

export default SubmenuLabel;
