import { BuilderOrganizationTree } from '@/data-contracts/mdbuilder/data-contracts';

export interface DraftTree
  extends Omit<
    BuilderOrganizationTree,
    'orgId' | 'name' | 'treeLevel' | 'shortName' | 'branches' | 'responsibilityCodePart' | 'responsibilityCodePartList'
  > {
  id?: BuilderOrganizationTree['orgId'];
  orgName?: BuilderOrganizationTree['name'];
  label?: BuilderOrganizationTree['shortName'];
  level?: BuilderOrganizationTree['treeLevel'];
  subItems?: BuilderOrganizationTree['branches'];
  responsibilityCode?: BuilderOrganizationTree['responsibilityCodePart'];
  responsibilityCodeList?: BuilderOrganizationTree['responsibilityCodePartList'];
  // Added
  orgNameShort?: BuilderOrganizationTree['shortName'];
}
