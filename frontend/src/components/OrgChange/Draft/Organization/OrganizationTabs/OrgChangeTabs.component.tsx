import Loader from '@components/Loader/Loader.component';
import { useAppContext } from '@contexts/app.context';
import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { Tabs } from '@sk-web-gui/react';
import { useEffect, useMemo } from 'react';
import { OperationInOrgChange } from './OperationInOrganization/OperationInOrgChange.component';
import { PeopleInOrgChange } from './PeopleInOrganization/PeopleInOrgChange.component';
import { ResponsibilityInOrgChange } from './ResponsibilityInOrganization/ResponsibilityInOrgChange.component';

interface OrganizationTabsProps {
  organization: OrgChangeOrganizationTree;
}

export default function OrgChangeTabs({ organization }: OrganizationTabsProps) {
  const { highlightedTableRow } = useAppContext();
  const organizationTabIndex = useOrganizationStore((s) => s.organizationTabIndex);
  const setOrganizationTabIndex = useOrganizationStore((s) => s.setOrganizationTabIndex);

  const getResponsibilitiesByOrg = useOrgChangeStore((s) => s.getResponsibilitiesByOrg);
  const getOperationsByOrg = useOrgChangeStore((s) => s.getOperationsByOrg);
  const getEmployeesByOrg = useOrgChangeStore((s) => s.getEmployeesByOrg);
  const employeesByOrgIsLoading = useOrgChangeStore((s) => s.employeesByOrgIsLoading);
  const responsibilitiesByOrgIsLoading = useOrgChangeStore((s) => s.responsibilitiesByOrgIsLoading);
  const operationsByOrgIsLoading = useOrgChangeStore((s) => s.operationsByOrgIsLoading);

  const employeesByOrg = useOrgChangeStore((s) => s.employeesByOrg);
  const responsibilitiesByOrg = useOrgChangeStore((s) => s.responsibilitiesByOrg);
  const operationsByOrg = useOrgChangeStore((s) => s.operationsByOrg);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const organizationMemo = useMemo(() => organization, [organization, highlightedTableRow]);

  useEffect(() => {
    let controllerResp, controllerOp, controllerEmp;
    if (organizationMemo.id) {
      controllerResp = new AbortController();
      controllerOp = new AbortController();
      controllerEmp = new AbortController();
      if (organization.isLeafLevel) {
        getEmployeesByOrg(organizationMemo.id, controllerEmp.signal);
        getResponsibilitiesByOrg(organizationMemo.id, controllerResp.signal);
        getOperationsByOrg(organizationMemo.id, controllerOp.signal);
      }
    }
    return () => {
      controllerResp?.abort();
      controllerOp?.abort();
      controllerEmp?.abort();
      getEmployeesByOrg(null);
      getResponsibilitiesByOrg(null);
      getOperationsByOrg(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationMemo]);

  /**
   *
   * @param index tab index clicked
   * @param tab tab object data
   */
  const handleTabsOnClickCallback = (event, item, index) => {
    setOrganizationTabIndex(index);
  };

  if (!organization.isLeafLevel) {
    return <></>;
  }

  return (
    <Tabs
      activeIndex={organizationTabIndex}
      className="py-md mb-sm"
      listClassName="mx-lg w-[calc(100%_-_4.8rem)] h-auto lg:h-[3rem]"
      tabs={[
        {
          id: 'employees',
          icon: employeesByOrgIsLoading ? <Loader size="md" aria-label="Hämtar personer" /> : undefined,
          label: employeesByOrgIsLoading ? 'Personer' : `Personer (${employeesByOrg.length})`,
          children: !employeesByOrgIsLoading && <PeopleInOrgChange />,
        },
        {
          id: 'responsibilities',
          icon: responsibilitiesByOrgIsLoading ? <Loader size="md" aria-label="Hämtar ansvar" /> : undefined,
          label: responsibilitiesByOrgIsLoading
            ? 'Kopplade ansvar'
            : `Kopplade ansvar (${responsibilitiesByOrg.length})`,
          children: !responsibilitiesByOrgIsLoading && <ResponsibilityInOrgChange />,
        },
        {
          id: 'operations',
          icon: operationsByOrgIsLoading ? <Loader size="md" aria-label="Hämtar verksamheter" /> : undefined,
          label: operationsByOrgIsLoading ? 'Verksamheter' : `Verksamheter (${operationsByOrg.length})`,
          children: !operationsByOrgIsLoading && <OperationInOrgChange />,
        },
      ]}
      onTabClick={handleTabsOnClickCallback}
    />
  );
}
