import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import VerifyResult from '../BottomInfoBar/VerifyResults.component';
import ChangesInOrganization from './ChangesInOrganization/ChangesInOrganization.components';
import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { __DEV__ } from '@sk-web-gui/react';

interface CompilationInfoInOrganizationProps {
  organization: OrgChangeOrganizationTree;
}

export default function CompilationInfoInOrganization({ organization }: CompilationInfoInOrganizationProps) {
  const verifyResultsByOrgId = useOrgChangeStore((s) => s.verifyResultsByOrgId);

  return (
    <div className="flex flex-col gap-4 py-md">
      {organization.changes > 0 && __DEV__ && <ChangesInOrganization changesCount={organization.changes} />}
      {organization.changes > 0 && verifyResultsByOrgId && verifyResultsByOrgId[organization.id] && (
        <VerifyResult selectedOrganizationId={organization.id} />
      )}
    </div>
  );
}
