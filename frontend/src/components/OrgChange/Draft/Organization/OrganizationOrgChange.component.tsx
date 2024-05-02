import OrgChangeTabs from '@components/OrgChange/Draft/Organization/OrganizationTabs/OrgChangeTabs.component';
import OrgNameEdit from '@components/Organization/OrgNameEdit/OrgNameEdit.component';
import { OrgChangeOrganizationTree } from '@data-contracts/backend/data-contracts';
import { DraftTreeOrganization } from '@interfaces/orgchange';
import { useOrganizationStore } from '@services/mdviewer/organization-service';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import CompilationInfoInOrganization from '../CompilationInfoInOrganization/CompilationInfoInOrganization.component';
import ActionHeaderBranch from './ActionHeaderBranch.component';

export default function OrganizationOrgChange() {
  const organization = useOrganizationStore((s) => s.organization) as OrgChangeOrganizationTree;
  const orgTree = useOrganizationStore((s) => s.orgTree) as OrgChangeOrganizationTree[];
  const { draftIsReadOnly } = useDraftPhaseState();

  return organization && organization?.id !== null ?
      <div className="relative">
        <section className="bg-white">
          {!draftIsReadOnly && <ActionHeaderBranch organization={organization as DraftTreeOrganization} />}
          <OrgNameEdit
            newItem={organization.structureChangeStatus === 'NEW'}
            organization={organization}
            orgChangeOrg={organization}
            orgTree={orgTree}
            isEdit
          />
          <CompilationInfoInOrganization organization={organization} />
          <OrgChangeTabs organization={organization} />
        </section>
      </div>
    : <div className="relative">
        <div className="w-full pt-lg h-full flex justify-center">
          <div>Ingen organisation vald.</div>
        </div>
      </div>;
}
