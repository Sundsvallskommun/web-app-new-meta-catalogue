import React, { useEffect, Fragment } from 'react';

// The app router has no route change events, so only leaving or reloading the page (beforeunload) is guarded.
function WarnIfUnsavedChanges({ children, showWarning }: { children: React.ReactNode; showWarning: boolean }) {
  useEffect(() => {
    const warningText = 'Du har osparade ändringar. Är du säker på att du vill lämna den här sidan?';
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!showWarning) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    window.addEventListener('beforeunload', handleWindowClose);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [showWarning]);
  return <Fragment>{children}</Fragment>;
}

export default WarnIfUnsavedChanges;
