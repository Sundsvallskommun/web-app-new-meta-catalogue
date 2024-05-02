import LoaderFullScreen from '@components/Loader/LoaderFullScreen.component';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const LoginGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { setIsOrgChange } = useAppContext();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const getMe = useUserStore((s) => s.getMe);

  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getMe()
      .then((me) => {
        setUser(me);
      })
      .catch(() => {
        // potential pre-login-cleanup
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set isOrgChange based on route
  useEffect(() => {
    if (router.pathname.includes('hanteraorganisation')) {
      setIsOrgChange(true);
    } else {
      setIsOrgChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.pathname]);

  if (!mounted || (!user.name && !router.pathname.includes('/login'))) {
    return <LoaderFullScreen />;
  }

  // Routes by permissions
  if (
    (router.pathname == '/hanteraorganisation' && !user.permissions.canViewDrafts) ||
    (router.pathname == '/hanteraorganisation/utkast' && !user.permissions.canEditOrganizationStructure)
  ) {
    router.push('/');
    return <LoaderFullScreen />;
  }

  return <>{children}</>;
};

export default LoginGuard;
