import { Tooltip, Icon } from '@sk-web-gui/react';
import { CircleQuestionMark } from 'lucide-react';
import { useState } from 'react';

interface HelpToolTipProps {
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  onlyIcon?: boolean;
  tabIndex?: number;
}

export const HelpTooltip: React.FC<HelpToolTipProps> = (props: HelpToolTipProps) => {
  const { children, ariaLabel = 'Mer information', className = '', onlyIcon, tabIndex, ...rest } = props;
  const [open, setOpen] = useState(false);

  return (
    <span
      className={`ml-sm align-text-bottom relative hidden lg:inline-flex ${className}`}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button type="button" tabIndex={tabIndex} className="flex items-center" aria-label={ariaLabel} {...rest}>
        {!onlyIcon && <span className="mr-5">Hjälp</span>}
        <Icon icon={<CircleQuestionMark />} />
      </button>
      <Tooltip position="below" className={open ? 'absolute top-full left-0 z-10 w-max max-w-2xl' : 'hidden'}>
        {children}
      </Tooltip>
    </span>
  );
};
