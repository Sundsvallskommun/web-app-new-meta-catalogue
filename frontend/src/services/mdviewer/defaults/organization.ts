import { Organization, OrganizationTree } from '@data-contracts/backend/data-contracts';

export const emptyRootOrganization: Organization = {
  id: null,
  level: null,
  orgName: 'Organisationsnamn',
  abbreviation: '',
  orgNameShort: '',
  parentId: null,
  isLeafLevel: false,
  responsibilityCode: null,
  companyId: null,
};

export const emptyOrganization: OrganizationTree = {
  organizationId: '',
  id: null,
  level: null,
  abbreviation: '',
  label: 'Organisationsnamn med kortnamn',
  orgName: 'Organisationsnamn',
  orgNameShort: '',
  parentId: null,
  isLeafLevel: false,
  responsibilityCode: null,
  responsibilityList: null,
  subItems: null,
};
