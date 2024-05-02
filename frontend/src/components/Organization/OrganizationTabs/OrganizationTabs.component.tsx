import Loader from '@components/Loader/Loader.component';
import { useAppContext } from '@contexts/app.context';
import { OrganizationTree } from '@data-contracts/backend/data-contracts';
import { useEmployeesStore } from '@services/mdviewer/employment-service';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useOperationStore } from '@services/mdviewer/operation-service';
import { useResponsibilityStore } from '@services/mdviewer/responsibility-service';
import { useUserStore } from '@services/user-service/user-service';
import { Tabs } from '@sk-web-gui/react';
import { useEffect, useMemo } from 'react';
import { OperationInOrganization } from './OperationInOrganization/OperationInOrganization';
import { PeopleInOrganization } from './PeopleInOrganization/PeopleInOrganization';
import { ResponsibilityInOrganization } from './ResponsibilityInOrganization/ResponsibilityInOrganization';

interface OrganizationTabsProps {
  organization: OrganizationTree;
}

export default function OrganizationTabs({ organization }: OrganizationTabsProps) {
  const { highlightedTableRow } = useAppContext();

  // userstore
  const user = useUserStore((s) => s.user);

  // employeestore
  const employeesByOrg = useEmployeesStore((s) => s.employeesByOrg);
  const employeesByOrgIsLoading = useEmployeesStore((s) => s.employeesByOrgIsLoading);
  const getEmployeesByOrg = useEmployeesStore((s) => s.getEmployeesByOrg);
  const getEmployeesByOrgAndUnder = useEmployeesStore((s) => s.getEmployeesByOrgAndUnder);

  // responsibilitystore
  const responsibilitiesByOrg = useResponsibilityStore((s) => s.responsibilitiesByOrg);
  const responsibilitiesByOrgIsLoading = useResponsibilityStore((s) => s.responsibilitiesByOrgIsLoading);
  const getResponsibilitiesByOrg = useResponsibilityStore((s) => s.getResponsibilitiesByOrg);
  const getResponsibilitiesByOrgAndUnder = useResponsibilityStore((s) => s.getResponsibilitiesByOrgAndUnder);

  // operationstore
  const operationsByOrg = useOperationStore((s) => s.operationsByOrg);
  const operationsByOrgIsLoading = useOperationStore((s) => s.operationsByOrgIsLoading);
  const getOperationsByOrg = useOperationStore((s) => s.getOperationsByOrg);
  const getOperationsByOrgAndUnder = useOperationStore((s) => s.getOperationsByOrgAndUnder);

  //organizationstore
  const organizationTabIndex = useOrganizationStore((s) => s.organizationTabIndex);
  const setOrganizationTabIndex = useOrganizationStore((s) => s.setOrganizationTabIndex);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const organizationMemo = useMemo(() => organization, [organization, highlightedTableRow]);

  useEffect(() => {
    let controllerResp, controllerOp, controllerEmp;
    if (organizationMemo.id) {
      controllerResp = new AbortController();
      controllerOp = new AbortController();
      controllerEmp = new AbortController();
      if (organizationMemo.isLeafLevel) {
        getResponsibilitiesByOrg(organizationMemo.id, controllerResp.signal);
        getOperationsByOrg(organizationMemo.id, controllerOp.signal);
        getEmployeesByOrg(organizationMemo.id, controllerEmp.signal);
      } else {
        getResponsibilitiesByOrgAndUnder(organizationMemo.id, controllerResp.signal);
        getOperationsByOrgAndUnder(organizationMemo.id, controllerOp.signal);
        getEmployeesByOrgAndUnder(organizationMemo.id, controllerEmp.signal);
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
          children: !employeesByOrgIsLoading && <PeopleInOrganization />,
        },
        ...(user.role !== 'meta_read'
          ? [
              {
                id: 'responsibilities',
                icon: responsibilitiesByOrgIsLoading ? <Loader size="md" aria-label="Hämtar ansvar" /> : undefined,
                label: responsibilitiesByOrgIsLoading
                  ? 'Kopplade ansvar'
                  : `Kopplade ansvar (${responsibilitiesByOrg.length})`,
                children: !responsibilitiesByOrgIsLoading && <ResponsibilityInOrganization />,
              },
            ]
          : []),
        ...(user.role !== 'meta_read'
          ? [
              {
                id: 'operations',
                icon: operationsByOrgIsLoading ? <Loader size="md" aria-label="Hämtar verksamheter" /> : undefined,
                label: operationsByOrgIsLoading ? 'Verksamheter' : `Verksamheter (${operationsByOrg.length})`,
                children: !operationsByOrgIsLoading && <OperationInOrganization />,
              },
            ]
          : []),
      ]}
      onTabClick={handleTabsOnClickCallback}
    />
  );
}
