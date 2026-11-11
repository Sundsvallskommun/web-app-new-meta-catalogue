'use client';

import { useEffect } from 'react';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
import { useEmployeesStore } from '@services/mdviewer/employment-service';
import { useOperationStore } from '@services/mdviewer/operation-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useResponsibilityStore } from '@services/mdviewer/responsibility-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { appURL } from '@utils/app-url';

export default function Logout() {
  const { setDefaults } = useAppContext();

  const resetUser = useUserStore((s) => s.reset);

  const resetEmployee = useEmployeesStore((s) => s.reset);
  const resetOperation = useOperationStore((s) => s.reset);
  const resetOrganization = useOrganizationStore((s) => s.reset);
  const resetResponsibility = useResponsibilityStore((s) => s.reset);
  const resetOrgChange = useOrgChangeStore((s) => s.reset);

  useEffect(() => {
    setDefaults();
    resetUser();
    resetEmployee();
    resetOperation();
    resetOrganization();
    resetResponsibility();
    resetOrgChange();
    localStorage.clear();
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/saml/logout`);
    url.searchParams.set('successRedirect', `${appURL()}/login?loggedout`);
    window.location.assign(url.toString());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
