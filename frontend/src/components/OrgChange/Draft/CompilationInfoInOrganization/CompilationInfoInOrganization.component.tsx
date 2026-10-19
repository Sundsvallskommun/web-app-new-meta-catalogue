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
  const showChanges = organization.changes > 0 && __DEV__;
  const showVerifyResult = organization.changes > 0 && verifyResultsByOrgId && verifyResultsByOrgId[organization.id];

  if (!showChanges && !showVerifyResult) return null;

  return (
    <div className="flex flex-col gap-10">
      {showChanges && <ChangesInOrganization changesCount={organization.changes} />}
      {showVerifyResult && <VerifyResult selectedOrganizationId={organization.id} />}
    </div>
  );
}
