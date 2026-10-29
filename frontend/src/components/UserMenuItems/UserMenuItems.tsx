import { Button } from '@sk-web-gui/react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/router';
import { useUserStore } from '@services/user-service/user-service';

export const useMenuItems = () => {
  const router = useRouter();
  const { user } = useUserStore();

  const menuItems = [
    {
      label: 'Main',
      elements: [
        {
          label: 'Rapportera fel',
          element: () => (
            <Button
              key={'feedback'}
              onClick={() =>
                router.replace({ query: { ...router.query, feedback: 'OTHER' } }, undefined, { shallow: true })
              }
            >
              Rapportera fel
            </Button>
          ),
        },
        !router.pathname.includes('/hanteraorganisation') && {
          label: 'Hantera organisation',
          permissions: user.permissions.canViewDrafts,
          element: () => (
            <Button key={'hanteraorganisation'} onClick={() => router.push('/hanteraorganisation')}>
              Hantera organisation
            </Button>
          ),
        },
        router.pathname.includes('/hanteraorganisation') && {
          label: 'Masterdata',
          element: () => (
            <Button key={'masterdata'} onClick={() => router.push('/')}>
              Masterdata
            </Button>
          ),
        },
      ],
    },
    {
      label: 'Logga ut',
      elements: [
        {
          label: 'Logga ut',
          element: () => (
            <Button
              data-cy="nav-span-loggaUt"
              key={'logout'}
              leftIcon={<LogOut />}
              onClick={() => router.push('/logout')}
            >
              Logga ut
            </Button>
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
