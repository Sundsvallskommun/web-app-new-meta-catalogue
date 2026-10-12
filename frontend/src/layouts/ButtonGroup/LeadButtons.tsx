export const LeadButtons: React.FC<{ children?: React.ReactNode; className? }> = ({ children, className }) => {
  return (
    <div
      className={`${className} flex flex-col mt-[40px] ${
        Array.isArray(children) ? 'sm:flex-row sm:grid sm:grid-cols-2 gap-md sm:gap-[40px]' : ''
      }`}
    >
      {children}
    </div>
  );
};

export default LeadButtons;
