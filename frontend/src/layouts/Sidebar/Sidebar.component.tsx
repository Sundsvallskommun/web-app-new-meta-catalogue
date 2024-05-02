import React from 'react';

interface SidebarProps {
  aside: React.ReactNode;
  children?: React.ReactNode;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>((props, ref) => {
  const { aside, children } = props;

  return (
    <div className="Sidebar container relative grow">
      {aside}
      {children && (
        <main id="content" tabIndex={-1} className="border-none shadow-md rounded-sm bg-white" ref={ref}>
          {children}
        </main>
      )}
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
