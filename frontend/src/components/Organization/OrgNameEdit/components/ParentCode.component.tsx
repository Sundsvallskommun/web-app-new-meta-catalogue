import { cx } from '@sk-web-gui/react';

// Height leaves 4px above and below inside the input; the negative margin trims the Input.LeftAddin padding to the same 4px.
// The md Input.LeftAddin only gets its right padding from the md breakpoint, so below it the chip keeps the text apart itself.
const sizes = {
  sm: 'h-22 -ml-6',
  md: 'h-30 -ml-8 mr-8 md:mr-0',
};

/** Read-only code prefix shown as a chip inside an Input.LeftAddin */
export const ParentCode = ({ code, size }: { code: string; size: keyof typeof sizes }) => (
  <span className={cx('flex items-center px-8 rounded-utility bg-background-200 text-dark-secondary', sizes[size])}>
    {code}
  </span>
);
