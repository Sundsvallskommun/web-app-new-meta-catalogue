import { ButtonGroup } from '@sk-web-gui/react';

export const LeadButtons: React.FC<{ children?: React.ReactNode; className? }> = ({ children, className }) => {
  return (
    <ButtonGroup
      className={`${className} flex flex-col mt-[40px] ${
        Array.isArray(children) ? 'sm:flex-row sm:grid sm:grid-cols-2 gap-md sm:gap-[40px]' : ''
      }`}
    >
      {children}
    </ButtonGroup>
  );
};

export default LeadButtons;
