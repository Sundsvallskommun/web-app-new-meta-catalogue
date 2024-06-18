import { useAppContext } from '@contexts/app.context';
import {
  OrgChangeOrganizationTree,
  OrganizationTree,
  OrgnodeChangeRespCodeDto,
  OrgnodeRenameDto,
} from '@data-contracts/backend/data-contracts';
import { EditOrganizationDto } from '@interfaces/orgchange';
import { ServiceResponse } from '@interfaces/service';
import { useOrgChangeStore } from '@services/mdbuilder/orgchange-service';
import { useUserStore } from '@services/user-service/user-service';
import { isPropertiesChanged } from '@utils/isPropertiesChanged';
import { useDraftPhaseState } from '@utils/use-draft-phase-state';
import OrgNameEditForm from './OrgNameEditForm.component';

interface IOrgName {
  newItem: boolean;
  organization: OrganizationTree;
  orgChangeOrg: OrgChangeOrganizationTree;
  orgTree: OrganizationTree[];
  isEdit?: boolean;
}

const OrgNameEdit = ({ newItem, organization, isEdit = false, orgTree, orgChangeOrg }: IOrgName) => {
  const { isOrgChange } = useAppContext();
  const user = useUserStore((s) => s.user);

  const formData = {
    orgId: organization.id,
    orgName: organization.orgName,
    treeLevel: organization.level,
    parentId: organization.parentId,
    abbreviation: organization.abbreviation,
    orgNameShort: organization.orgNameShort,
    isLeafLevel: organization.isLeafLevel,
    responsibilityCode: organization.responsibilityCode,
    parentResponsibilityCode: '',
  };

  const editNode = useOrgChangeStore((s) => s.editNode);
  const { draftIsReadOnly } = useDraftPhaseState();

  const handleSubmitCallback: (data: EditOrganizationDto) => Promise<ServiceResponse<boolean>> = async (
    data: EditOrganizationDto
  ) => {
    if (isOrgChange) {
      const editNamesData: OrgnodeRenameDto =
        (
          isPropertiesChanged(organization, {
            id: data.orgId,
            orgName: data.orgName,
            orgNameShort: data.orgNameShort,
            abbreviation: data.abbreviation,
          })
        ) ?
          {
            orgId: data.orgId,
            name: data.orgName,
            shortName: data.orgNameShort,
            abbreviation: data.abbreviation,
          }
        : undefined;
      const editRespCodeData: OrgnodeChangeRespCodeDto =
        (
          isPropertiesChanged(organization, {
            id: data.orgId,
            responsibilityCode: data.responsibilityCode,
          })
        ) ?
          {
            orgId: data.orgId,
            newRespCodePart: data.responsibilityCode,
          }
        : undefined;
      return editNode(editNamesData, editRespCodeData);
    }
  };

  return (
    <div className="px-8 pt-lg bg-white">
      {(!isEdit ||
        (isOrgChange && draftIsReadOnly) ||
        (isOrgChange && orgChangeOrg.structureChangeStatus === 'DELETED')) && (
        <h1
          className={`text-2xl text-gray flex flex-col lg:flex-row ${
            orgChangeOrg && orgChangeOrg.structureChangeStatus === 'DELETED' && 'italic'
          }`}
        >
          <span className="pr-sm font-bold">
            {organization && organization.orgName ? organization.orgName : 'Organizationsnamn'}
          </span>
          {organization && organization.orgNameShort ?
            <span className=" px-sm border-l border-neutral-100 font-normal">{organization.orgNameShort}</span>
          : ''}
          {organization && !organization.isLeafLevel && organization.abbreviation ?
            <span className=" px-sm border-l border-neutral-100 font-normal">{organization.abbreviation}</span>
          : ''}
          {organization && organization.responsibilityCode && user.permissions.canViewDrafts ?
            <span className=" px-sm border-l border-neutral-100 font-normal">{organization.responsibilityCode}</span>
          : ''}
          {orgChangeOrg && orgChangeOrg.structureChangeStatus === 'DELETED' && (
            <span className="font-normal">- &#91;Stängd&#93;</span>
          )}
        </h1>
      )}
      {user.permissions.canEditOrganization &&
        isOrgChange &&
        !draftIsReadOnly &&
        orgTree &&
        orgChangeOrg?.structureChangeStatus !== 'DELETED' && (
          <OrgNameEditForm
            newItem={newItem}
            formData={formData}
            submitCallback={handleSubmitCallback}
            orgTree={orgTree}
            orgChangeOrg={orgChangeOrg}
          />
        )}
    </div>
  );
};

export default OrgNameEdit;
