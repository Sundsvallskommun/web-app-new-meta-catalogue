import LoaderFullScreen from '@components/Loader/LoaderFullScreen.component';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const LoginGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { setIsOrgChange } = useAppContext();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const getMe = useUserStore((s) => s.getMe);

  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Routes by permissions
  const isForbiddenRoute =
    !!user.name &&
    ((pathname == '/hanteraorganisation' && !user.permissions.canViewDrafts) ||
      (pathname == '/hanteraorganisation/utkast' && !user.permissions.canEditOrganizationStructure));

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
    if (pathname.includes('hanteraorganisation')) {
      setIsOrgChange(true);
    } else {
      setIsOrgChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (isForbiddenRoute) {
      router.push('/');
    }
  }, [isForbiddenRoute, router]);

  if (!mounted || (!user.name && !pathname.includes('/login')) || isForbiddenRoute) {
    return <LoaderFullScreen />;
  }

  return <>{children}</>;
};

export default LoginGuard;
