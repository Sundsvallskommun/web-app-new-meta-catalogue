import { Link } from '@sk-web-gui/react';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useUserStore } from '@services/user-service/user-service';

export const useMenuItems = () => {
  const router = useRouter();
  const { user } = useUserStore();

  const menuItems = [
    {
      label: 'Main',
      showLabel: false,
      showOnDesktop: true,
      showOnMobile: true,
      elements: [
        {
          label: 'Rapportera systemfel',
          permissions: user.permissions.canEditSystemMessages,
          element: (active: boolean) => (
            <NextLink
              key={'feedback'}
              href={{
                pathname: window.location.pathname,
                query: { ...router.query, feedback: 'SYSTEM' },
              }}
              shallow
              replace
              className={`usermenu-item ${active ? 'active' : ''}`}
            >
              <span className="inline">Rapportera systemfel</span>
            </NextLink>
          ),
        },
        !router.pathname.includes('/hanteraorganisation') && {
          label: 'Hantera organisation',
          permissions: user.permissions.canViewDrafts,
          element: (active: boolean) => (
            <NextLink
              key={'hanteraorganisation'}
              href={`/hanteraorganisation`}
              className={`usermenu-item ${active ? 'active' : ''}`}
            >
              <span className="inline">Hantera organisation</span>
            </NextLink>
          ),
        },
        router.pathname.includes('/hanteraorganisation') && {
          label: 'Masterdata',
          element: (active: boolean) => (
            <NextLink key={'masterdata'} href={`/`} className={`usermenu-item ${active ? 'active' : ''}`}>
              <span className="inline">Masterdata</span>
            </NextLink>
          ),
        },
      ],
    },
    {
      label: 'Logga ut',
      showLabel: true,
      showOnDesktop: true,
      showOnMobile: true,
      elements: [
        {
          label: 'Logga ut',
          element: (active: boolean) => (
            <Link
              data-cy="nav-span-loggaUt"
              key={'logout'}
              href={`/logout`}
              className={`usermenu-item ${active ? 'active' : ''}`}
            >
              <LogoutOutlinedIcon className="material-icon mr-sm" aria-hidden="true" />
              <span className="inline">Logga ut</span>
            </Link>
          ),
        },
      ],
    },
  ];

  // Handle return based by permissions
  return menuItems.map((section) => {
    const elements = [];
    section.elements.filter((item) => {
      if (!item) return false;
      if (item.permissions == undefined) {
        elements.push(item);
        return true;
      }
      if (item.permissions !== undefined && item.permissions) {
        delete item.permissions;
        elements.push(item);
        return true;
      }
      return false;
    });
    section.elements = elements;
    return section;
  });
};
