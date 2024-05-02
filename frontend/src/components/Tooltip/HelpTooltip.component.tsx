import { Popover } from '@headlessui/react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface HelpToolTipProps {
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
  onlyIcon?: boolean;
  tabIndex?: number;
}

export const HelpTooltip: React.FC<HelpToolTipProps> = (props: HelpToolTipProps) => {
  const { children, ariaLabel = 'Mer information', className = '', onlyIcon, tabIndex, ...rest } = props;
  return (
    <Popover
      className={`ml-sm align-text-bottom relative hidden lg:inline-flex ${className}`}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      {() => (
        <>
          <Popover.Button tabIndex={tabIndex} className="flex items-center" aria-label={ariaLabel} {...rest}>
            {!onlyIcon && <strong className="mr-2">Hjälp</strong>}
            <HelpOutlineIcon sx={{ fontSize: 16 }} className="" />
          </Popover.Button>

          <Popover.Panel
            focus={true}
            style={{ width: '90vw' }}
            className="absolute max-w-2xl top-8 left-0 right-auto lg:max-w-2xl z-10 rounded-md text-left text-black bg-white p-4 border border-gray-stroke"
          >
            <span className="inline-block">{children}</span>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};
