import { useRouter } from 'next/router';
import React, { useEffect, Fragment } from 'react';

function WarnIfUnsavedChanges({ children, showWarning }: { children: React.ReactNode; showWarning: boolean }) {
  const router = useRouter();
  useEffect(() => {
    const warningText = 'Du har osparade ändringar. Är du säker på att du vill lämna den här sidan?';
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!showWarning) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    const handleBrowseAway = (route) => {
      if (!showWarning || route == '/login' || route == router.pathname) return;
      if (window.confirm(warningText)) return;
      router.events.emit('routeChangeError');
      throw 'routeChange aborted.';
    };
    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showWarning]);
  return <Fragment>{children}</Fragment>;
}

export default WarnIfUnsavedChanges;
